import { generateId } from '../utils/helpers.js';
import { getCharacter } from './characters.js';

/**
 * Adds an entry to the undo log.
 * @param {Object} chatState
 * @param {Object} entryData
 */
export function addUndoEntry(chatState, entryData) {
    if (!chatState.undoLog) chatState.undoLog = [];

    const entry = {
        id: generateId('undo_'),
        timestamp: new Date().toISOString(),
        undone: false,
        ...entryData
    };

    chatState.undoLog.push(entry);

    // Keep log trimmed
    const MAX_ENTRIES = 200; // Hardcode default for now, could be passed in
    if (chatState.undoLog.length > MAX_ENTRIES) {
        chatState.undoLog.shift();
    }
}

/**
 * Reverts a specific change.
 * @param {Object} chatState
 * @param {string} entryId
 * @returns {boolean} success
 */
export function undoEntry(chatState, entryId) {
    if (!chatState.undoLog) return false;
    const entry = chatState.undoLog.find(e => e.id === entryId);
    
    if (!entry || entry.undone) return false;

    const character = getCharacter(chatState, entry.characterId);
    if (character) {
        character.values[entry.field] = entry.oldValue;
        entry.undone = true;
        return true;
    }
    return false;
}

/**
 * Reverts all changes from a specific message index.
 * @param {Object} chatState
 * @param {number} messageIndex
 * @returns {number} number of changes reverted
 */
export function undoMessageChanges(chatState, messageIndex) {
    if (!chatState.undoLog) return 0;
    
    let undoneCount = 0;
    // Iterate backwards to undo in reverse order
    for (let i = chatState.undoLog.length - 1; i >= 0; i--) {
        const entry = chatState.undoLog[i];
        if (entry.messageIndex === messageIndex && !entry.undone) {
            if (undoEntry(chatState, entry.id)) {
                undoneCount++;
            }
        }
    }
    return undoneCount;
}

/**
 * Gets the entire undo log.
 * @param {Object} chatState
 * @returns {Object[]}
 */
export function getUndoLog(chatState) {
    return chatState.undoLog || [];
}

/**
 * Gets the undo log for a specific character.
 * @param {Object} chatState
 * @param {string} characterId
 * @returns {Object[]}
 */
export function getUndoLogForCharacter(chatState, characterId) {
    return (chatState.undoLog || []).filter(e => e.characterId === characterId);
}

/**
 * Clears the undo log.
 * @param {Object} chatState
 */
export function clearUndoLog(chatState) {
    chatState.undoLog = [];
}

/**
 * Gets configured max undo entries.
 * @param {Object} globalSettings
 * @returns {number}
 */
export function getMaxUndoEntries(globalSettings) {
    return globalSettings.maxUndoEntries || 200;
}
