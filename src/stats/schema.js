import { log, generateId, deepClone } from '../utils/helpers.js';
import { getPreset, applyPreset } from './presets.js';

/**
 * @typedef {Object} VariableDefinition
 * @property {string} id
 * @property {string} name
 * @property {string} tag
 * @property {string} category 'identity'|'resources'|'attributes'|'sections'|'custom'
 * @property {'number'|'string'|'boolean'|'list'} type
 * @property {any} defaultValue
 * @property {boolean} isBaseline
 * @property {string} [color]
 * @property {boolean} [showBar]
 * @property {number|null} [min]
 * @property {number|null} [max]
 * @property {boolean} [canDecrease]
 * @property {boolean} [canIncrease]
 * @property {boolean} [allowNegative]
 * @property {number|null} [flagThreshold]
 */

const BASELINE_VARIABLES = [
    { id: 'base_name', name: 'Name', tag: 'Name', category: 'identity', type: 'string', defaultValue: '', isBaseline: true },
    { id: 'base_class', name: 'Class', tag: 'Class', category: 'identity', type: 'string', defaultValue: 'Adventurer', isBaseline: true },
    { id: 'base_race', name: 'Race', tag: 'Race', category: 'identity', type: 'string', defaultValue: 'Human', isBaseline: true },
    { id: 'base_gender', name: 'Gender', tag: 'Gender', category: 'identity', type: 'string', defaultValue: 'Unknown', isBaseline: true },
    { id: 'base_level', name: 'Level', tag: 'Level', category: 'attributes', type: 'number', defaultValue: 1, isBaseline: true, min: 1, canDecrease: false },
    { id: 'base_hp', name: 'HP', tag: 'HP', category: 'resources', type: 'number', defaultValue: 100, isBaseline: true, showBar: true, color: '#f44336' },
    { id: 'base_mp', name: 'MP', tag: 'MP', category: 'resources', type: 'number', defaultValue: 100, isBaseline: true, showBar: true, color: '#2196f3' }
];

/**
 * Creates a schema with baseline variables and optional preset.
 * @param {string} [presetName]
 * @returns {Object}
 */
export function createDefaultSchema(presetName = null) {
    try {
        const schema = { variables: deepClone(BASELINE_VARIABLES), presetName: null };
        if (presetName) {
            applyPreset(schema, presetName);
        }
        return schema;
    } catch (error) {
        log('error', 'Error creating default schema', error);
        return { variables: deepClone(BASELINE_VARIABLES), presetName: null };
    }
}

/**
 * Gets the schema from chat state.
 * @param {Object} chatState
 * @returns {Object}
 */
export function getSchema(chatState) {
    if (!chatState.schema) {
        chatState.schema = createDefaultSchema();
    }
    return chatState.schema;
}

/**
 * Adds a custom variable to the schema.
 * @param {Object} schema
 * @param {VariableDefinition} varDef
 * @returns {Object} Updated schema
 */
export function addVariable(schema, varDef) {
    if (!varDef.id) varDef.id = generateId('var_');
    if (schema.variables.some(v => v.tag.toLowerCase() === varDef.tag.toLowerCase())) {
        throw new Error(`Variable with tag ${varDef.tag} already exists.`);
    }
    schema.variables.push(varDef);
    return schema;
}

/**
 * Removes a variable from the schema.
 * @param {Object} schema
 * @param {string} varId
 */
export function removeVariable(schema, varId) {
    const index = schema.variables.findIndex(v => v.id === varId);
    if (index === -1) return schema;
    if (schema.variables[index].isBaseline) {
        throw new Error('Cannot remove baseline variable.');
    }
    schema.variables.splice(index, 1);
    return schema;
}

/**
 * Updates a variable's properties.
 * @param {Object} schema
 * @param {string} varId
 * @param {Object} updates
 */
export function updateVariable(schema, varId, updates) {
    const variable = getVariableById(schema, varId);
    if (!variable) throw new Error('Variable not found.');
    Object.assign(variable, updates);
    return schema;
}

/**
 * Renames a variable.
 * @param {Object} schema
 * @param {string} varId
 * @param {string} newName
 */
export function renameVariable(schema, varId, newName) {
    const variable = getVariableById(schema, varId);
    if (!variable) throw new Error('Variable not found.');
    variable.name = newName;
    return schema;
}

/**
 * Gets a variable by its tag.
 * @param {Object} schema
 * @param {string} tag
 * @returns {VariableDefinition|undefined}
 */
export function getVariableByTag(schema, tag) {
    return schema.variables.find(v => v.tag.toLowerCase() === tag.toLowerCase());
}

/**
 * Gets a variable by its ID.
 * @param {Object} schema
 * @param {string} varId
 * @returns {VariableDefinition|undefined}
 */
export function getVariableById(schema, varId) {
    return schema.variables.find(v => v.id === varId);
}

/**
 * Gets variables by category.
 * @param {Object} schema
 * @param {string} category
 * @returns {VariableDefinition[]}
 */
export function getVariablesByCategory(schema, category) {
    return schema.variables.filter(v => v.category === category);
}

/**
 * Gets all variables with showBar=true.
 * @param {Object} schema
 * @returns {VariableDefinition[]}
 */
export function getBarVariables(schema) {
    return schema.variables.filter(v => v.showBar);
}

/**
 * Gets all tags.
 * @param {Object} schema
 * @returns {string[]}
 */
export function getAllTags(schema) {
    return schema.variables.map(v => v.tag);
}

/**
 * Validates the schema.
 * @param {Object} schema
 * @returns {boolean}
 */
export function validateSchema(schema) {
    if (!schema || !Array.isArray(schema.variables)) return false;
    const tags = new Set();
    for (const v of schema.variables) {
        if (!v.id || !v.tag || !v.name || !v.type) return false;
        const lowerTag = v.tag.toLowerCase();
        if (tags.has(lowerTag)) return false;
        tags.add(lowerTag);
    }
    return true;
}
