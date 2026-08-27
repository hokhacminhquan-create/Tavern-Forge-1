import { log, generateId } from '../utils/helpers.js';
import { getVariableByTag } from './schema.js';

const PRESETS = {
    fantasy: {
        name: 'fantasy',
        displayName: 'Fantasy RPG',
        description: 'Classic fantasy stats and magic.',
        variables: [
            { id: generateId('var_'), name: 'Strength', tag: 'STR', category: 'attributes', type: 'number', defaultValue: 10, min: 1, max: 20 },
            { id: generateId('var_'), name: 'Dexterity', tag: 'DEX', category: 'attributes', type: 'number', defaultValue: 10, min: 1, max: 20 },
            { id: generateId('var_'), name: 'Constitution', tag: 'CON', category: 'attributes', type: 'number', defaultValue: 10, min: 1, max: 20 },
            { id: generateId('var_'), name: 'Intelligence', tag: 'INT', category: 'attributes', type: 'number', defaultValue: 10, min: 1, max: 20 },
            { id: generateId('var_'), name: 'Wisdom', tag: 'WIS', category: 'attributes', type: 'number', defaultValue: 10, min: 1, max: 20 },
            { id: generateId('var_'), name: 'Charisma', tag: 'CHA', category: 'attributes', type: 'number', defaultValue: 10, min: 1, max: 20 },
            { id: generateId('var_'), name: 'Stamina', tag: 'Stamina', category: 'resources', type: 'number', defaultValue: 100, min: 0, max: 100, showBar: true, color: '#4caf50' },
            { id: generateId('var_'), name: 'Gold', tag: 'Gold', category: 'resources', type: 'number', defaultValue: 0, min: 0, allowNegative: false },
            { id: generateId('var_'), name: 'XP', tag: 'XP', category: 'resources', type: 'number', defaultValue: 0, min: 0, showBar: true, color: '#9c27b0' },
            { id: generateId('var_'), name: 'Skills', tag: 'Skills', category: 'sections', type: 'list', defaultValue: [] },
            { id: generateId('var_'), name: 'Spells', tag: 'Spells', category: 'sections', type: 'list', defaultValue: [] },
            { id: generateId('var_'), name: 'Passives', tag: 'Passives', category: 'sections', type: 'list', defaultValue: [] },
            { id: generateId('var_'), name: 'Inventory', tag: 'Inventory', category: 'sections', type: 'list', defaultValue: [] },
            { id: generateId('var_'), name: 'Equipment', tag: 'Equipment', category: 'sections', type: 'list', defaultValue: [] },
            { id: generateId('var_'), name: 'Status Effects', tag: 'StatusEffects', category: 'sections', type: 'list', defaultValue: [] }
        ]
    },
    'sci-fi': {
        name: 'sci-fi',
        displayName: 'Sci-Fi',
        description: 'Futuristic attributes, energy, and tech.',
        renames: { 'MP': 'Energy' },
        variables: [
            { id: generateId('var_'), name: 'Strength', tag: 'STR', category: 'attributes', type: 'number', defaultValue: 10, min: 1, max: 20 },
            { id: generateId('var_'), name: 'Agility', tag: 'AGI', category: 'attributes', type: 'number', defaultValue: 10, min: 1, max: 20 },
            { id: generateId('var_'), name: 'Technology', tag: 'TEC', category: 'attributes', type: 'number', defaultValue: 10, min: 1, max: 20 },
            { id: generateId('var_'), name: 'Intelligence', tag: 'INT', category: 'attributes', type: 'number', defaultValue: 10, min: 1, max: 20 },
            { id: generateId('var_'), name: 'Perception', tag: 'PER', category: 'attributes', type: 'number', defaultValue: 10, min: 1, max: 20 },
            { id: generateId('var_'), name: 'Charisma', tag: 'CHA', category: 'attributes', type: 'number', defaultValue: 10, min: 1, max: 20 },
            { id: generateId('var_'), name: 'Shield', tag: 'Shield', category: 'resources', type: 'number', defaultValue: 100, min: 0, max: 100, showBar: true, color: '#00bcd4' },
            { id: generateId('var_'), name: 'Credits', tag: 'Credits', category: 'resources', type: 'number', defaultValue: 0, min: 0 },
            { id: generateId('var_'), name: 'Abilities', tag: 'Abilities', category: 'sections', type: 'list', defaultValue: [] },
            { id: generateId('var_'), name: 'Augments', tag: 'Augments', category: 'sections', type: 'list', defaultValue: [] },
            { id: generateId('var_'), name: 'Inventory', tag: 'Inventory', category: 'sections', type: 'list', defaultValue: [] },
            { id: generateId('var_'), name: 'Gear', tag: 'Gear', category: 'sections', type: 'list', defaultValue: [] },
            { id: generateId('var_'), name: 'Conditions', tag: 'Conditions', category: 'sections', type: 'list', defaultValue: [] }
        ]
    },
    modern: {
        name: 'modern',
        displayName: 'Modern',
        description: 'Contemporary settings, cash, and stress.',
        renames: { 'MP': 'Stamina' },
        variables: [
            { id: generateId('var_'), name: 'Physical', tag: 'PHY', category: 'attributes', type: 'number', defaultValue: 10, min: 1, max: 20 },
            { id: generateId('var_'), name: 'Reflexes', tag: 'REF', category: 'attributes', type: 'number', defaultValue: 10, min: 1, max: 20 },
            { id: generateId('var_'), name: 'Intelligence', tag: 'INT', category: 'attributes', type: 'number', defaultValue: 10, min: 1, max: 20 },
            { id: generateId('var_'), name: 'Charisma', tag: 'CHA', category: 'attributes', type: 'number', defaultValue: 10, min: 1, max: 20 },
            { id: generateId('var_'), name: 'Willpower', tag: 'WIL', category: 'attributes', type: 'number', defaultValue: 10, min: 1, max: 20 },
            { id: generateId('var_'), name: 'Perception', tag: 'PER', category: 'attributes', type: 'number', defaultValue: 10, min: 1, max: 20 },
            { id: generateId('var_'), name: 'Stress', tag: 'Stress', category: 'resources', type: 'number', defaultValue: 0, min: 0, max: 100, showBar: true, color: '#ff9800' },
            { id: generateId('var_'), name: 'Cash', tag: 'Cash', category: 'resources', type: 'number', defaultValue: 0, min: 0 },
            { id: generateId('var_'), name: 'Reputation', tag: 'Reputation', category: 'resources', type: 'number', defaultValue: 0, min: 0, max: 100, showBar: true, color: '#ffd700' },
            { id: generateId('var_'), name: 'Skills', tag: 'Skills', category: 'sections', type: 'list', defaultValue: [] },
            { id: generateId('var_'), name: 'Perks', tag: 'Perks', category: 'sections', type: 'list', defaultValue: [] },
            { id: generateId('var_'), name: 'Inventory', tag: 'Inventory', category: 'sections', type: 'list', defaultValue: [] },
            { id: generateId('var_'), name: 'Equipment', tag: 'Equipment', category: 'sections', type: 'list', defaultValue: [] },
            { id: generateId('var_'), name: 'Conditions', tag: 'Conditions', category: 'sections', type: 'list', defaultValue: [] }
        ]
    },
    horror: {
        name: 'horror',
        displayName: 'Horror',
        description: 'Survival horror, sanity, and trauma.',
        renames: { 'MP': 'Sanity' },
        variables: [
            { id: generateId('var_'), name: 'Strength', tag: 'STR', category: 'attributes', type: 'number', defaultValue: 10, min: 1, max: 20 },
            { id: generateId('var_'), name: 'Dexterity', tag: 'DEX', category: 'attributes', type: 'number', defaultValue: 10, min: 1, max: 20 },
            { id: generateId('var_'), name: 'Constitution', tag: 'CON', category: 'attributes', type: 'number', defaultValue: 10, min: 1, max: 20 },
            { id: generateId('var_'), name: 'Intelligence', tag: 'INT', category: 'attributes', type: 'number', defaultValue: 10, min: 1, max: 20 },
            { id: generateId('var_'), name: 'Willpower', tag: 'WIL', category: 'attributes', type: 'number', defaultValue: 10, min: 1, max: 20 },
            { id: generateId('var_'), name: 'Perception', tag: 'PER', category: 'attributes', type: 'number', defaultValue: 10, min: 1, max: 20 },
            { id: generateId('var_'), name: 'Supplies', tag: 'Supplies', category: 'resources', type: 'number', defaultValue: 10, min: 0, max: 100, showBar: true, color: '#795548' },
            { id: generateId('var_'), name: 'Skills', tag: 'Skills', category: 'sections', type: 'list', defaultValue: [] },
            { id: generateId('var_'), name: 'Traumas', tag: 'Traumas', category: 'sections', type: 'list', defaultValue: [] },
            { id: generateId('var_'), name: 'Inventory', tag: 'Inventory', category: 'sections', type: 'list', defaultValue: [] },
            { id: generateId('var_'), name: 'Weapons', tag: 'Weapons', category: 'sections', type: 'list', defaultValue: [] },
            { id: generateId('var_'), name: 'Afflictions', tag: 'Afflictions', category: 'sections', type: 'list', defaultValue: [] }
        ]
    }
};

/**
 * Returns preset data.
 * @param {string} name
 * @returns {Object|null}
 */
export function getPreset(name) {
    return PRESETS[name] || null;
}

/**
 * Lists all presets.
 * @returns {Array<{name: string, displayName: string, description: string}>}
 */
export function listPresets() {
    return Object.values(PRESETS).map(p => ({
        name: p.name,
        displayName: p.displayName,
        description: p.description
    }));
}

/**
 * Applies a preset to a schema.
 * @param {Object} schema
 * @param {string} presetName
 * @returns {Object} Updated schema
 */
export function applyPreset(schema, presetName) {
    const preset = getPreset(presetName);
    if (!preset) {
        log(`Preset ${presetName} not found.`);
        return schema;
    }

    schema.presetName = presetName;

    // Apply renames to baseline variables
    if (preset.renames) {
        for (const [tag, newName] of Object.entries(preset.renames)) {
            const v = getVariableByTag(schema, tag);
            if (v && v.isBaseline) {
                v.name = newName;
                if (presetName === 'sci-fi' && tag === 'MP') {
                    // special case, energy color? Or just rename.
                }
            }
        }
    }

    // Add variables
    for (const v of preset.variables) {
        if (!getVariableByTag(schema, v.tag)) {
            schema.variables.push({ ...v, isBaseline: false });
        }
    }

    return schema;
}
