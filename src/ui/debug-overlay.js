import { getGlobalSettings } from '../core/storage.js';

let debugOverlay$ = null;

export function renderDebugInfo(container$, parseResult, promptText) {
    if (!debugOverlay$) {
        debugOverlay$ = $('<div class="tf-debug-overlay"></div>');
        container$.append(debugOverlay$);
    }
    
    debugOverlay$.empty();
    debugOverlay$.append('<h3>Debug Info</h3>');
    
    if (parseResult) {
        debugOverlay$.append(`<p>Parsed updates: ${JSON.stringify(parseResult, null, 2)}</p>`);
    }
    
    if (promptText) {
        debugOverlay$.append(`<details><summary>Injected Prompt</summary><pre>${promptText}</pre></details>`);
    }
}

export function toggleDebugMode(enabled) {
    const settings = getGlobalSettings();
    if (enabled === undefined) {
        enabled = settings.debugMode;
    }
    if (enabled && debugOverlay$) {
        debugOverlay$.show();
    } else if (debugOverlay$) {
        debugOverlay$.hide();
    }
}
