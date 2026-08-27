/**
 * @module world-map
 * @description World map generation, storage, and lorebook matching.
 */

import { getGlobalSettings, updateGlobalSettings } from '../core/storage.js';

/**
 * @typedef {Object} WorldMapNode
 * @property {string} id
 * @property {string} name
 * @property {'settlement'|'wilderness'|'dungeon'|'landmark'|'other'} type
 * @property {string} description
 * @property {string} icon
 * @property {{x: number, y: number}|null} position
 */

/**
 * @typedef {Object} WorldMapEdge
 * @property {string} id
 * @property {string} from
 * @property {string} to
 * @property {string} label
 * @property {'road'|'path'|'river'|'sea'|'mountain_pass'|'other'} type
 */

/**
 * @typedef {Object} WorldMap
 * @property {string} id
 * @property {string} lorebookId
 * @property {string} name
 * @property {WorldMapNode[]} nodes
 * @property {WorldMapEdge[]} edges
 * @property {string} createdAt
 * @property {string} lastModified
 */

const WORLD_MAPS_KEY = 'tf_world_maps';

/**
 * Get cached world map for a lorebook
 * @param {Object} globalSettings 
 * @param {string} lorebookId 
 * @returns {WorldMap|null}
 */
export function getWorldMap(globalSettings, lorebookId) {
    const maps = globalSettings[WORLD_MAPS_KEY] || {};
    return maps[lorebookId] || null;
}

/**
 * Save world map to global settings library
 * @param {Object} globalSettings 
 * @param {WorldMap} worldMap 
 */
export function saveWorldMap(globalSettings, worldMap) {
    if (!globalSettings[WORLD_MAPS_KEY]) {
        globalSettings[WORLD_MAPS_KEY] = {};
    }
    worldMap.lastModified = new Date().toISOString();
    globalSettings[WORLD_MAPS_KEY][worldMap.lorebookId] = worldMap;
    // Since we mutate the object, we should call updateGlobalSettings to save
    updateGlobalSettings(WORLD_MAPS_KEY, globalSettings[WORLD_MAPS_KEY]);
}

/**
 * Delete a world map
 * @param {Object} globalSettings 
 * @param {string} lorebookId 
 */
export function deleteWorldMap(globalSettings, lorebookId) {
    if (globalSettings[WORLD_MAPS_KEY] && globalSettings[WORLD_MAPS_KEY][lorebookId]) {
        delete globalSettings[WORLD_MAPS_KEY][lorebookId];
        updateGlobalSettings(WORLD_MAPS_KEY, globalSettings[WORLD_MAPS_KEY]);
    }
}

/**
 * List all saved world maps with their lorebook IDs
 * @param {Object} globalSettings 
 * @returns {Array<{lorebookId: string, name: string}>}
 */
export function listWorldMaps(globalSettings) {
    const maps = globalSettings[WORLD_MAPS_KEY] || {};
    return Object.values(maps).map(m => ({ lorebookId: m.lorebookId, name: m.name }));
}

/**
 * Generate a world map from lorebook entries
 * @param {Array} lorebookEntries 
 * @param {string} lorebookId 
 * @param {string} lorebookName 
 * @returns {Promise<WorldMap|null>}
 */
export async function generateWorldMap(lorebookEntries, lorebookId, lorebookName) {
    try {
        const prompt = buildGenerationPrompt(lorebookEntries);
        const context = window.SillyTavern?.getContext?.();
        if (!context || !context.generateQuietPrompt) {
            console.error('Tavern Forge: context.generateQuietPrompt is unavailable');
            return null;
        }

        const responseText = await context.generateQuietPrompt(prompt, false, false);
        return parseGenerationResponse(responseText, lorebookId, lorebookName);
    } catch (e) {
        console.error('Tavern Forge: Failed to generate world map', e);
        return null;
    }
}

/**
 * Build the prompt for world map generation
 * @param {Array} lorebookEntries 
 * @returns {string}
 */
export function buildGenerationPrompt(lorebookEntries) {
    const contextStr = lorebookEntries.map(e => e.content).join('\n\n');
    return `Extract locations and connections from the following lorebook entries to build a world map.
Return the result strictly as a JSON object with the following structure, and nothing else (no markdown wrapping):
{
  "nodes": [
    { "id": "unique_string", "name": "Location Name", "type": "settlement|wilderness|dungeon|landmark|other", "description": "short description", "icon": "emoji" }
  ],
  "edges": [
    { "id": "unique_string", "from": "node_id_1", "to": "node_id_2", "label": "connection description", "type": "road|path|river|sea|mountain_pass|other" }
  ]
}

Lorebook entries:
${contextStr}
`;
}

/**
 * Parse AI response into WorldMap
 * @param {string} responseText 
 * @param {string} lorebookId 
 * @param {string} lorebookName 
 * @returns {WorldMap|null}
 */
export function parseGenerationResponse(responseText, lorebookId, lorebookName) {
    try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON found in response');
        }
        const data = JSON.parse(jsonMatch[0]);
        
        const now = new Date().toISOString();
        return {
            id: 'wm_' + Date.now().toString(),
            lorebookId,
            name: lorebookName || 'Generated Map',
            nodes: Array.isArray(data.nodes) ? data.nodes.map(n => ({ ...n, position: null })) : [],
            edges: Array.isArray(data.edges) ? data.edges : [],
            createdAt: now,
            lastModified: now
        };
    } catch (e) {
        console.error('Tavern Forge: Failed to parse generated map JSON', e, responseText);
        return null;
    }
}

/**
 * Add a node to the map
 * @param {WorldMap} worldMap 
 * @param {WorldMapNode} nodeData 
 */
export function addNode(worldMap, nodeData) {
    worldMap.nodes.push(nodeData);
    worldMap.lastModified = new Date().toISOString();
}

/**
 * Remove a node and its connected edges
 * @param {WorldMap} worldMap 
 * @param {string} nodeId 
 */
export function removeNode(worldMap, nodeId) {
    worldMap.nodes = worldMap.nodes.filter(n => n.id !== nodeId);
    worldMap.edges = worldMap.edges.filter(e => e.from !== nodeId && e.to !== nodeId);
    worldMap.lastModified = new Date().toISOString();
}

/**
 * Add an edge
 * @param {WorldMap} worldMap 
 * @param {WorldMapEdge} edgeData 
 */
export function addEdge(worldMap, edgeData) {
    worldMap.edges.push(edgeData);
    worldMap.lastModified = new Date().toISOString();
}

/**
 * Remove an edge
 * @param {WorldMap} worldMap 
 * @param {string} edgeId 
 */
export function removeEdge(worldMap, edgeId) {
    worldMap.edges = worldMap.edges.filter(e => e.id !== edgeId);
    worldMap.lastModified = new Date().toISOString();
}

/**
 * Update node properties
 * @param {WorldMap} worldMap 
 * @param {string} nodeId 
 * @param {Object} updates 
 */
export function updateNode(worldMap, nodeId, updates) {
    const node = worldMap.nodes.find(n => n.id === nodeId);
    if (node) {
        Object.assign(node, updates);
        worldMap.lastModified = new Date().toISOString();
    }
}

/**
 * Find node by name (case-insensitive)
 * @param {WorldMap} worldMap 
 * @param {string} name 
 * @returns {WorldMapNode|undefined}
 */
export function findNodeByName(worldMap, name) {
    const lowerName = name.toLowerCase();
    return worldMap.nodes.find(n => n.name.toLowerCase() === lowerName);
}
