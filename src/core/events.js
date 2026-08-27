/**
 * Event hook registration for Tavern Forge.
 */

import { parseMarkers } from './parser.js';
import { getChatState, getGlobalSettings, updateChatState, initializeChatState, initializeGlobalSettings } from './storage.js';
import { injectPrompt } from './prompt-engine.js';
import { processStatChanges } from '../stats/delta-processor.js';
import { getSchema } from '../stats/schema.js';
import { updateScene } from '../scene/scene-manager.js';
import { renderMessageVisuals } from '../visuals/visual-renderer.js';
import { log } from '../utils/helpers.js';

let isRegistered = false;

function onMessageReceived(messageId) {
    try {
        const context = window.SillyTavern?.getContext?.();
        if (!context || !context.chat) return;

        const msgData = context.chat[messageId];
        if (!msgData || msgData.is_user) return;
        
        const result = parseMarkers(msgData.mes);
        msgData.extra = msgData.extra || {};
        msgData.extra.tavern_forge = result;
        
        // Strip markers from displayed message
        if (result.cleanText !== msgData.mes) {
            msgData.mes = result.cleanText;
        }
        
        const chatState = getChatState();
        const schema = getSchema(chatState);

        // Handle Scene updates using scene-manager
        if (result.sceneUpdate) {
            updateScene(chatState, result.sceneUpdate);
            updateChatState('scene', chatState.scene);
        }
        
        // Process stat changes
        if (result.statChanges && result.statChanges.length > 0) {
            const processingResult = processStatChanges(result.statChanges, chatState, schema, messageId);
            log('info', `Stats processed: ${processingResult.applied.length} applied, ${processingResult.rejected.length} rejected, ${processingResult.flagged.length} flagged`);
        }
        
        // Store quest updates
        if (result.questUpdates && result.questUpdates.length > 0) {
            log('info', 'Quest updates detected:', result.questUpdates);
            // TODO: Route to quest manager
        }
        
        // Re-inject updated prompt for next generation
        injectPrompt(getChatState(), getGlobalSettings());
    } catch (e) {
        log('error', 'Error in MESSAGE_RECEIVED handler', e);
    }
}

function onChatChanged() {
    try {
        initializeChatState();
        injectPrompt(getChatState(), getGlobalSettings());
    } catch (e) {
        log('error', 'Error in CHAT_CHANGED handler', e);
    }
}

function onAppReady() {
    try {
        initializeGlobalSettings();
        initializeChatState();
    } catch (e) {
        log('error', 'Error in APP_READY handler', e);
    }
}

export function registerEventHooks() {
    const context = window.SillyTavern?.getContext?.();
    if (!context || !context.eventSource || isRegistered) return;
    
    const types = context.event_types;
    
    context.eventSource.on(types.MESSAGE_RECEIVED, onMessageReceived);
    context.eventSource.on(types.CHAT_CHANGED, onChatChanged);
    context.eventSource.on(types.APP_READY, onAppReady);
    
    // Connect visual rendering
    context.eventSource.on(types.CHARACTER_MESSAGE_RENDERED, (messageId) => {
        try { 
            if (messageId !== undefined) {
                renderMessageVisuals(messageId);
            }
        } catch (e) { log('error', e); }
    });
    
    context.eventSource.on(types.MESSAGE_SWIPED, () => {
        try { /* Revert stats */ } catch (e) { log('error', e); }
    });
    
    context.eventSource.on(types.GENERATION_STARTED, () => {
        try { injectPrompt(getChatState(), getGlobalSettings()); } catch (e) { log('error', e); }
    });
    
    isRegistered = true;
    log('info', 'Event hooks registered');
}

export function unregisterEventHooks() {
    const context = window.SillyTavern?.getContext?.();
    if (!context || !context.eventSource || !isRegistered) return;
    
    const types = context.event_types;
    
    context.eventSource.removeListener(types.MESSAGE_RECEIVED, onMessageReceived);
    context.eventSource.removeListener(types.CHAT_CHANGED, onChatChanged);
    context.eventSource.removeListener(types.APP_READY, onAppReady);
    
    isRegistered = false;
    log('info', 'Event hooks unregistered');
}
