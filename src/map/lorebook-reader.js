/**
 * @module lorebook-reader
 * @description Reads lorebook entries from SillyTavern and structures them.
 */

const LOREBOOK_CACHE_KEY = 'tf_lorebook_cache';

/**
 * Get the ID of the currently active lorebook/world info
 * @returns {string|null}
 */
export function getActiveLorebookId() {
    const context = window.SillyTavern?.getContext?.();
    if (context && context.chatMetadata && context.chatMetadata.world_info) {
        // Determine active lorebook based on ST data structure
        return context.chatMetadata.world_info_id || 'default_lorebook';
    }
    return null;
}

/**
 * Read all entries from the active lorebook.
 * @returns {Array} Array of { key, content, ... } objects
 */
export function getLorebookEntries() {
    // This requires access to ST's lorebook data structures.
    // For now, return an empty array if undefined
    return [];
}

/**
 * Check if lorebook has been modified since last processing
 * @param {Object} globalSettings 
 * @param {string} lorebookId 
 * @returns {boolean}
 */
export function hasLorebookChanged(globalSettings, lorebookId) {
    // Compare hash or entry count logic here
    return true;
}

/**
 * Convert prose lorebook entries into structured RPG data
 * @param {Array} lorebookEntries 
 * @returns {Promise<Object>}
 */
export async function structureLorebookData(lorebookEntries) {
    try {
        const prompt = buildStructuringPrompt(lorebookEntries);
        const context = window.SillyTavern?.getContext?.();
        if (context && context.generateQuietPrompt) {
            const responseText = await context.generateQuietPrompt(prompt, false, false);
            // parse response...
            return { raw: responseText };
        }
        return {};
    } catch (e) {
        console.error('Tavern Forge: Failed to structure lorebook data', e);
        return {};
    }
}

/**
 * Get cached structured data
 * @param {Object} globalSettings 
 * @param {string} lorebookId 
 * @returns {Object|null}
 */
export function getCachedLorebookData(globalSettings, lorebookId) {
    const cache = globalSettings[LOREBOOK_CACHE_KEY] || {};
    return cache[lorebookId] || null;
}

/**
 * Cache structured data
 * @param {Object} globalSettings 
 * @param {string} lorebookId 
 * @param {Object} data 
 */
export function saveCachedLorebookData(globalSettings, lorebookId, data) {
    if (!globalSettings[LOREBOOK_CACHE_KEY]) {
        globalSettings[LOREBOOK_CACHE_KEY] = {};
    }
    globalSettings[LOREBOOK_CACHE_KEY][lorebookId] = data;
}

/**
 * Build the prompt for structuring lorebook data
 * @param {Array} entries 
 * @returns {string}
 */
export function buildStructuringPrompt(entries) {
    const contextStr = entries.map(e => e.content).join('\n\n');
    return `Extract structured RPG data from the following lorebook entries.
Find characters (name, class, race, notable traits), locations (name, type, connections), and factions.
Return as JSON.
Entries:
${contextStr}
`;
}
