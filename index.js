/**
 * Main entry point for the Tavern Forge SillyTavern extension.
 */

import { MODULE_KEY } from './src/core/constants.js';
import { initializeGlobalSettings, initializeChatState, getChatState, getGlobalSettings } from './src/core/storage.js';
import { registerEventHooks, unregisterEventHooks } from './src/core/events.js';
import { injectPrompt, clearPrompt } from './src/core/prompt-engine.js';
import { createPanel } from './src/ui/panel.js';
import { registerAllTemplates } from './src/visuals/template-engine.js';
import { registerAllCommands, unregisterAllCommands } from './src/utils/slash-commands.js';
import { log } from './src/utils/helpers.js';

/**
 * Safely get the SillyTavern context.
 * @returns {Object|null}
 */
function getContext() {
    return window.SillyTavern?.getContext?.() || null;
}

/**
 * Called when the extension is first installed or loaded.
 * Initializes global settings.
 */
export function onInstall() {
    try {
        log('info', 'onInstall triggered');
        initializeGlobalSettings();
    } catch (error) {
        log('error', 'Error in onInstall:', error);
    }
}

/**
 * Called when the extension activates.
 * Registers events and initializes chat state if a chat is active.
 */
export function onActivate() {
    try {
        log('info', 'onActivate triggered');
        registerEventHooks();
        registerAllTemplates();
        registerAllCommands();
        createPanel();
        
        const context = getContext();
        // If there's an active chat, initialize chat state
        if (context && context.chatId) {
            initializeChatState();
            injectPrompt(getChatState(), getGlobalSettings());
        }
    } catch (error) {
        log('error', 'Error in onActivate:', error);
    }
}

/**
 * Called to enable the extension.
 * Registers hooks and injects prompt.
 */
export function onEnable() {
    try {
        log('info', 'onEnable triggered');
        registerEventHooks();
        const context = getContext();
        if (context && context.chatId) {
            injectPrompt(getChatState(), getGlobalSettings());
        }
    } catch (error) {
        log('error', 'Error in onEnable:', error);
    }
}

/**
 * Called to disable the extension.
 * Unregisters hooks and clears prompt.
 */
export function onDisable() {
    try {
        log('info', 'onDisable triggered');
        unregisterEventHooks();
        unregisterAllCommands();
        const panel = jQuery('#tf-panel');
        if (panel.length) panel.remove();
        const bubble = jQuery('#tf-bubble');
        if (bubble.length) bubble.remove();
        clearPrompt();
    } catch (error) {
        log('error', 'Error in onDisable:', error);
    }
}

/**
 * Generator interceptor called before prompt assembly.
 * Ensures the injected prompt is up to date based on current state.
 * @param {Array} chatHistory - The current chat history.
 */
export function tavernForgeInterceptor(chatHistory) {
    try {
        const context = getContext();
        if (context && context.chatId) {
            injectPrompt(getChatState(), getGlobalSettings());
        }
    } catch (error) {
        log('error', 'Error in tavernForgeInterceptor:', error);
    }
}

// Make lifecycle functions available globally for manifest hooks
globalThis.onInstall = onInstall;
globalThis.onActivate = onActivate;
globalThis.onEnable = onEnable;
globalThis.onDisable = onDisable;
globalThis.tavernForgeInterceptor = tavernForgeInterceptor;

// Auto-initialization
jQuery(document).ready(function () {
    try {
        // Wait for SillyTavern context to be available
        const checkContext = setInterval(() => {
            const context = getContext();
            if (context) {
                clearInterval(checkContext);
                
                onInstall();
                onActivate();
                
                log('info', 'Tavern Forge loaded successfully');
            }
        }, 500);
    } catch (error) {
        log('error', 'Error during initialization:', error);
    }
});
