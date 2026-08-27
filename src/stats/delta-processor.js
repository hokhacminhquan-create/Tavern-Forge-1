import { log } from '../utils/helpers.js';
import { getCharacterByName, getPlayerCharacter } from './characters.js';
import { checkConstraints } from './sanity.js';
import { getVariableByTag } from './schema.js';
import { addUndoEntry } from './undo-log.js';

/**
 * Processes stat change deltas.
 * @param {Array} statChanges
 * @param {Object} chatState
 * @param {Object} schema
 * @returns {Object} { applied, rejected, flagged }
 */
export function processStatChanges(statChanges, chatState, schema, messageIndex = -1) {
    const results = { applied: [], rejected: [], flagged: [] };

    for (const statChange of statChanges) {
        const target = statChange.target;
        const changes = statChange.changes || [];

        const character = resolveTarget(target, chatState);
        if (!character) {
            results.rejected.push({ target, reason: 'Target character not found' });
            continue;
        }

        for (const change of changes) {
            try {
                const tag = change.field;
                const delta = change.delta;
                const operation = change.operation || 'add';

                const variable = getVariableByTag(schema, tag);
                if (!variable) {
                    results.rejected.push({ target, tag, reason: `Variable ${tag} not found in schema` });
                    continue;
                }

                const { oldValue, newValue, clamped, flags, reason } = applyDelta(character, tag, delta, operation, schema);

                if (reason) {
                    results.rejected.push({ target, tag, reason });
                } else {
                    const appliedEntry = {
                        characterId: character.id,
                        characterName: character.name,
                        tag,
                        oldValue,
                        newValue,
                        delta,
                        clamped
                    };

                    results.applied.push(appliedEntry);
                    if (flags && flags.length > 0) {
                        results.flagged.push({ entry: appliedEntry, flags });
                    }

                    addUndoEntry(chatState, {
                        messageIndex,
                        characterId: character.id,
                        characterName: character.name,
                        field: tag,
                        fieldName: variable.name,
                        oldValue,
                        newValue,
                        delta,
                        flags: flags || []
                    });
                }
            } catch (e) {
                log('error', `Error processing change for ${target}:`, e);
                results.rejected.push({ target, reason: e.message });
            }
        }
    }

    return results;
}

/**
 * Apply a single delta.
 * @param {Object} character
 * @param {string} tag
 * @param {any} delta
 * @param {string} operation 'add' | 'set'
 * @param {Object} schema
 * @returns {Object}
 */
export function applyDelta(character, tag, delta, operation, schema) {
    const variable = getVariableByTag(schema, tag);
    const oldValue = character.values[tag];
    let proposedValue = oldValue;

    if (operation === 'add') {
        if (variable.type === 'number') {
            proposedValue = (Number(oldValue) || 0) + Number(delta);
        } else if (variable.type === 'list') {
            // handle list append
            proposedValue = Array.isArray(oldValue) ? [...oldValue, delta] : [delta];
        }
    } else if (operation === 'set') {
        proposedValue = delta;
    } else if (operation === 'remove' && variable.type === 'list') {
        proposedValue = Array.isArray(oldValue) ? oldValue.filter(i => i !== delta) : [];
    }

    const { allowed, clampedValue, flags, reason } = checkConstraints(variable, oldValue, proposedValue, delta);

    if (!allowed) {
        return { oldValue, newValue: oldValue, clamped: false, flags, reason };
    }

    character.values[tag] = clampedValue;
    return { oldValue, newValue: clampedValue, clamped: clampedValue !== proposedValue, flags, reason: null };
}

/**
 * Resolve target string to character object.
 * @param {string} target
 * @param {Object} chatState
 * @returns {Object|undefined}
 */
export function resolveTarget(target, chatState) {
    if (!target || target.toLowerCase() === 'player') {
        return getPlayerCharacter(chatState);
    }
    
    if (target.toLowerCase().startsWith('npc:')) {
        const name = target.substring(4);
        return getCharacterByName(chatState, name);
    }

    return getCharacterByName(chatState, target);
}
