/**
 * Storage manager for Tavern Forge extension.
 */

import { MODULE_KEY, DEFAULT_GLOBAL_SETTINGS, DEFAULT_CHAT_STATE } from './constants.js';
import { deepClone, setNestedValue, getNestedValue } from '../utils/helpers.js';

// Get context safely
function getContext() {
    return window.SillyTavern?.getContext?.() || {};
}

export function initializeGlobalSettings() {
    const context = getContext();
    if (!context.extensionSettings) return;
    if (!context.extensionSettings[MODULE_KEY]) {
        context.extensionSettings[MODULE_KEY] = deepClone(DEFAULT_GLOBAL_SETTINGS);
        context.saveSettingsDebounced?.();
    }
}

export function initializeChatState() {
    const context = getContext();
    if (!context.chatMetadata) return;
    if (!context.chatMetadata[MODULE_KEY]) {
        context.chatMetadata[MODULE_KEY] = deepClone(DEFAULT_CHAT_STATE);
        context.saveChatDebounced?.();
    }
}

export function getGlobalSettings() {
    const context = getContext();
    return context.extensionSettings?.[MODULE_KEY] || deepClone(DEFAULT_GLOBAL_SETTINGS);
}

export function getChatState() {
    const context = getContext();
    return context.chatMetadata?.[MODULE_KEY] || deepClone(DEFAULT_CHAT_STATE);
}

export function updateGlobalSettings(path, value) {
    const context = getContext();
    if (!context.extensionSettings) return;
    if (!context.extensionSettings[MODULE_KEY]) initializeGlobalSettings();
    
    setNestedValue(context.extensionSettings[MODULE_KEY], path, value);
    context.saveSettingsDebounced?.();
}

export function updateChatState(path, value) {
    const context = getContext();
    if (!context.chatMetadata) return;
    if (!context.chatMetadata[MODULE_KEY]) initializeChatState();
    
    setNestedValue(context.chatMetadata[MODULE_KEY], path, value);
    context.saveChatDebounced?.();
}

export function resetChatState() {
    const context = getContext();
    if (context.chatMetadata) {
        context.chatMetadata[MODULE_KEY] = deepClone(DEFAULT_CHAT_STATE);
        context.saveChatDebounced?.();
    }
}

export function resetGlobalSettings() {
    const context = getContext();
    if (context.extensionSettings) {
        context.extensionSettings[MODULE_KEY] = deepClone(DEFAULT_GLOBAL_SETTINGS);
        context.saveSettingsDebounced?.();
    }
}

export function exportChatState() {
    return JSON.parse(JSON.stringify(getChatState()));
}

export function importChatState(data) {
    const context = getContext();
    if (context.chatMetadata && data) {
        context.chatMetadata[MODULE_KEY] = JSON.parse(JSON.stringify(data));
        context.saveChatDebounced?.();
    }
}
