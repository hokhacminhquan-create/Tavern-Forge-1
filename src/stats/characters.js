import { log, generateId, deepClone } from '../utils/helpers.js';

/**
 * Creates a new character based on the schema.
 * @param {string} name
 * @param {'player'|'special'|'npc'} type
 * @param {Object} schema
 * @param {Object} [initialValues]
 * @returns {Object} CharacterState
 */
export function createCharacter(name, type, schema, initialValues = {}) {
    const char = {
        id: generateId('char_'),
        name: name,
        type: type,
        values: {},
        maxValues: {},
        statusEffects: [],
        inventory: [],
        equipment: {},
        skills: [],
        passives: [],
        trackedFields: null
    };

    schema.variables.forEach(v => {
        char.values[v.tag] = initialValues[v.tag] !== undefined ? initialValues[v.tag] : v.defaultValue;
        if (v.showBar && typeof char.values[v.tag] === 'number') {
            char.maxValues[v.tag] = char.values[v.tag];
        }
    });

    return char;
}

/**
 * Gets a character by ID.
 * @param {Object} chatState
 * @param {string} characterId
 * @returns {Object|undefined}
 */
export function getCharacter(chatState, characterId) {
    return (chatState.characters || []).find(c => c.id === characterId);
}

/**
 * Gets a character by name (case-insensitive).
 * @param {Object} chatState
 * @param {string} name
 * @returns {Object|undefined}
 */
export function getCharacterByName(chatState, name) {
    const lowerName = name.toLowerCase();
    return (chatState.characters || []).find(c => c.name.toLowerCase() === lowerName);
}

/**
 * Gets the player character.
 * @param {Object} chatState
 * @returns {Object|undefined}
 */
export function getPlayerCharacter(chatState) {
    return (chatState.characters || []).find(c => c.type === 'player');
}

/**
 * Gets all characters.
 * @param {Object} chatState
 * @returns {Object[]}
 */
export function getAllCharacters(chatState) {
    return chatState.characters || [];
}

/**
 * Gets special characters only.
 * @param {Object} chatState
 * @returns {Object[]}
 */
export function getSpecialCharacters(chatState) {
    return (chatState.characters || []).filter(c => c.type === 'special');
}

/**
 * Gets NPCs only.
 * @param {Object} chatState
 * @returns {Object[]}
 */
export function getNPCs(chatState) {
    return (chatState.characters || []).filter(c => c.type === 'npc');
}

/**
 * Updates a character's value.
 * @param {Object} chatState
 * @param {string} charId
 * @param {string} tag
 * @param {any} value
 */
export function updateCharacterValue(chatState, charId, tag, value) {
    const char = getCharacter(chatState, charId);
    if (char) {
        char.values[tag] = value;
    }
}

/**
 * Removes a character.
 * @param {Object} chatState
 * @param {string} charId
 */
export function removeCharacter(chatState, charId) {
    if (!chatState.characters) return;
    chatState.characters = chatState.characters.filter(c => c.id !== charId);
}

/**
 * Sets a character's type.
 * @param {Object} chatState
 * @param {string} charId
 * @param {'player'|'special'|'npc'} newType
 */
export function setCharacterType(chatState, charId, newType) {
    const char = getCharacter(chatState, charId);
    if (char) {
        char.type = newType;
    }
}

/**
 * Builds a display summary for a character.
 * @param {Object} character
 * @param {Object} schema
 * @param {boolean} simplified
 * @returns {Object}
 */
export function getCharacterSummary(character, schema, simplified) {
    // simplified summary for UI display
    return {
        id: character.id,
        name: character.name,
        type: character.type,
        values: { ...character.values }
    };
}

/**
 * Builds a compressed prompt line for injection.
 * @param {Object} character
 * @param {Object} schema
 * @param {boolean} simplified
 * @returns {string}
 */
export function characterToPromptLine(character, schema, simplified) {
    let parts = [`[${character.name}]`];
    
    let fieldsToProcess = schema.variables;
    if (simplified && character.trackedFields) {
        fieldsToProcess = schema.variables.filter(v => character.trackedFields.includes(v.tag));
    }

    fieldsToProcess.forEach(v => {
        const val = character.values[v.tag];
        if (val !== undefined && val !== null && val !== '') {
            if (v.type === 'list' && Array.isArray(val) && val.length > 0) {
                parts.push(`${v.tag}: ${val.join(', ')}`);
            } else if (v.type !== 'list') {
                if (v.showBar && character.maxValues[v.tag]) {
                    parts.push(`${v.tag}: ${val}/${character.maxValues[v.tag]}`);
                } else {
                    parts.push(`${v.tag}: ${val}`);
                }
            }
        }
    });

    return parts.join(' | ');
}
