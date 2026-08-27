import { log } from '../utils/helpers.js';
import { getCharacterByName, createCharacter, getCharacter } from './characters.js';

/**
 * Promotes a character to special.
 * @param {Object} chatState
 * @param {string} characterName
 * @param {Object} schema
 * @returns {Object} The promoted character
 */
export function promoteToSpecial(chatState, characterName, schema) {
    let char = getCharacterByName(chatState, characterName);
    
    if (char) {
        char.type = 'special';
    } else {
        char = createCharacter(characterName, 'special', schema);
        if (!chatState.characters) chatState.characters = [];
        chatState.characters.push(char);
    }
    
    return char;
}

/**
 * Demotes a special character to NPC.
 * @param {Object} chatState
 * @param {string} characterId
 */
export function demoteFromSpecial(chatState, characterId) {
    const char = getCharacter(chatState, characterId);
    if (char && char.type === 'special') {
        char.type = 'npc';
    }
}

/**
 * Gets all special characters.
 * @param {Object} chatState
 * @returns {Object[]}
 */
export function getSpecialCharacters(chatState) {
    return (chatState.characters || []).filter(c => c.type === 'special');
}

/**
 * Checks if a character is special.
 * @param {Object} chatState
 * @param {string} characterId
 * @returns {boolean}
 */
export function isSpecialCharacter(chatState, characterId) {
    const char = getCharacter(chatState, characterId);
    return char ? char.type === 'special' : false;
}

/**
 * Builds the prompt for AI character stat generation.
 * @param {string} characterName
 * @param {Object} chatState
 * @param {Object} schema
 * @param {Array} recentMessages
 * @returns {string}
 */
export function buildPromotionPrompt(characterName, chatState, schema, recentMessages) {
    const tags = schema.variables.map(v => v.tag).join(', ');
    const contextText = recentMessages.slice(-30).map(m => `${m.name}: ${m.mes}`).join('\n');
    
    return `Generate RPG stats for character "${characterName}" based on the recent story context.
Required fields to fill: ${tags}
Respond ONLY with valid JSON in the format: { "values": { "TAG": value } }

Recent context:
${contextText}`;
}

/**
 * Parses the AI response for character promotion.
 * @param {string} responseText
 * @param {Object} schema
 * @returns {Object|null}
 */
export function parsePromotionResponse(responseText, schema) {
    try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            log('No JSON found in promotion response.');
            return null;
        }
        
        const data = JSON.parse(jsonMatch[0]);
        if (!data.values) return null;
        
        // Ensure values match schema types roughly
        const validatedValues = {};
        for (const [key, val] of Object.entries(data.values)) {
            const vDef = schema.variables.find(v => v.tag === key);
            if (vDef) validatedValues[key] = val;
        }
        
        return { values: validatedValues };
    } catch (e) {
        log('Error parsing promotion response.', e);
        return null;
    }
}
