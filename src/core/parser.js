/**
 * Unified marker parser for Tavern Forge.
 */

import { IMMERSIVE_REGEX, SCENE_REGEX, RPG_REGEX, QUEST_REGEX } from './constants.js';

/**
 * @typedef {Object} ParseResult
 * @property {string} cleanText
 * @property {Array<Object>} immersiveElements
 * @property {Object|null} sceneUpdate
 * @property {Array<Object>} statChanges
 * @property {Array<Object>} questUpdates
 * @property {string[]} rawMarkers
 */

/**
 * Parses raw AI text for all markers.
 * @param {string} text Raw message text
 * @returns {ParseResult}
 */
export function parseMarkers(text) {
    let cleanText = text;
    const rawMarkers = [];
    const immersiveElements = [];
    let sceneUpdate = null;
    const statChanges = [];
    const questUpdates = [];

    // Process Immersive Markers
    const immMatches = [...cleanText.matchAll(IMMERSIVE_REGEX)];
    for (const match of immMatches) {
        rawMarkers.push(match[0]);
        const type = match[1];
        const attrString = match[2];
        const content = match[3];
        const startIndex = match.index;
        const endIndex = match.index + match[0].length;

        const attributes = {};
        attrString.split('|').forEach(pair => {
            const [k, v] = pair.split(':');
            if (k && v) attributes[k.trim()] = v.trim();
        });

        immersiveElements.push({ type, attributes, content, originalMatch: match[0], startIndex, endIndex });
        cleanText = cleanText.replace(match[0], ''); // Remove from text
    }

    // Process Scene Markers
    const sceneMatches = [...cleanText.matchAll(SCENE_REGEX)];
    for (const match of sceneMatches) {
        rawMarkers.push(match[0]);
        const attrString = match[1];
        sceneUpdate = sceneUpdate || {};
        attrString.split('|').forEach(pair => {
            const [k, v] = pair.split(':');
            if (k && v) {
                const key = k.trim();
                const val = v.trim();
                if (key === 'characters') {
                    sceneUpdate[key] = val.split(',').map(c => c.trim());
                } else if (key === 'characters_add') {
                    sceneUpdate.characters_add = val.split(',').map(c => c.trim());
                } else if (key === 'characters_remove') {
                    sceneUpdate.characters_remove = val.split(',').map(c => c.trim());
                } else {
                    sceneUpdate[key] = val;
                }
            }
        });
        cleanText = cleanText.replace(match[0], '');
    }

    // Process RPG Markers
    const rpgMatches = [...cleanText.matchAll(RPG_REGEX)];
    for (const match of rpgMatches) {
        rawMarkers.push(match[0]);
        const target = match[1];
        const changesStr = match[2];
        const changes = [];
        
        // Simple regex to match field+val, field-val, field=val
        const changeParts = changesStr.split('|');
        for (const part of changeParts) {
            const opMatch = part.match(/([^+-=]+)([+-=])(.*)/);
            if (opMatch) {
                const field = opMatch[1].trim();
                const op = opMatch[2];
                const val = opMatch[3].trim();
                const numericVal = isNaN(Number(val)) ? val : Number(val);
                
                let operation = 'set';
                let delta = numericVal;
                if (op === '+') { operation = 'add'; }
                else if (op === '-') { operation = 'add'; delta = typeof numericVal === 'number' ? -numericVal : val; }
                
                changes.push({ field, delta, operation });
            }
        }
        
        statChanges.push({ target, changes });
        cleanText = cleanText.replace(match[0], '');
    }

    // Process Quest Markers
    const questMatches = [...cleanText.matchAll(QUEST_REGEX)];
    for (const match of questMatches) {
        rawMarkers.push(match[0]);
        const action = match[1];
        const attrString = match[2];
        const data = {};
        
        attrString.split('|').forEach(pair => {
            const [k, v] = pair.split(':');
            if (k && v) data[k.trim()] = v.trim();
        });
        
        questUpdates.push({ action, data });
        cleanText = cleanText.replace(match[0], '');
    }

    return {
        cleanText: cleanText.trim(),
        immersiveElements,
        sceneUpdate,
        statChanges,
        questUpdates,
        rawMarkers
    };
}
