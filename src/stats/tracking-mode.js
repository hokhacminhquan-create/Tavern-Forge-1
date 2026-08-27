import { getPlayerCharacter, getSpecialCharacters, getAllCharacters } from './characters.js';

/**
 * Gets current tracking mode.
 * @param {Object} chatState
 * @returns {string} 'first_pov' or 'third_pov'
 */
export function getTrackingMode(chatState) {
    return chatState.trackingMode || 'first_pov';
}

/**
 * Sets tracking mode.
 * @param {Object} chatState
 * @param {string} mode 'first_pov' or 'third_pov'
 */
export function setTrackingMode(chatState, mode) {
    chatState.trackingMode = mode;
}

/**
 * Checks if a character should be fully tracked.
 * @param {Object} character
 * @param {Object} chatState
 * @returns {boolean}
 */
export function isFullyTracked(character, chatState) {
    const mode = getTrackingMode(chatState);
    if (mode === 'third_pov') return true;
    
    // First POV: only player and special characters
    return character.type === 'player' || character.type === 'special';
}

/**
 * Returns which fields to track for a character.
 * @param {Object} character
 * @param {Object} chatState
 * @param {Object} schema
 * @returns {string[]}
 */
export function getTrackedFields(character, chatState, schema) {
    if (isFullyTracked(character, chatState)) {
        return schema.variables.map(v => v.tag);
    }
    
    // Simplified NPC tracking
    if (character.trackedFields && Array.isArray(character.trackedFields)) {
        return character.trackedFields;
    }
    
    // Default simplified fields
    return ['HP', 'Level', 'StatusEffects'];
}

/**
 * Get NPC tracking config from global settings.
 * @param {Object} globalSettings
 * @returns {string[]}
 */
export function getNpcTrackingConfig(globalSettings) {
    return globalSettings.npcTrackedFields || ['HP', 'Level', 'StatusEffects'];
}

/**
 * Set NPC tracking config.
 * @param {Object} globalSettings
 * @param {string[]} fieldTags
 */
export function setNpcTrackingConfig(globalSettings, fieldTags) {
    globalSettings.npcTrackedFields = fieldTags;
}

/**
 * Gets characters organized for prompt injection.
 * @param {Object} chatState
 * @param {Object} schema
 * @returns {Object} { fullCharacters, simplifiedCharacters }
 */
export function getPromptRelevantCharacters(chatState, schema) {
    const mode = getTrackingMode(chatState);
    const allChars = getAllCharacters(chatState);
    
    const fullCharacters = [];
    const simplifiedCharacters = [];
    
    for (const char of allChars) {
        if (isFullyTracked(char, chatState)) {
            fullCharacters.push(char);
        } else {
            // Apply tracked fields config to simplified chars before returning if needed
            // The characterToPromptLine func will handle the filtering
            simplifiedCharacters.push(char);
        }
    }
    
    return { fullCharacters, simplifiedCharacters };
}
