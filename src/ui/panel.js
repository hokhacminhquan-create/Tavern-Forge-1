import { getGlobalSettings, updateGlobalSettings } from '../core/storage.js';
import { PANEL_MODE } from '../core/constants.js';
import { createTabs, getActiveTab, setActiveTab } from './tabs.js';

let panel$ = null;
let bubble$ = null;
let isDragging = false;
let isResizing = false;

/**
 * Creates and injects the panel DOM element.
 * @returns {jQuery} The panel jQuery element.
 */
export function createPanel() {
    if (panel$) return panel$;

    const settings = getGlobalSettings();
    const mode = settings.panelMode || PANEL_MODE.RIGHT_SIDEBAR;

    const html = `
        <div id="tf-panel" class="tavern-forge tf-panel tf-panel--${mode.toLowerCase().replace('_', '-')}">
            <div class="tf-panel__header">
                <span class="tf-panel__title">⚒️ Tavern Forge</span>
                <div class="tf-panel__controls">
                    <button class="tf-panel__btn" data-action="dock-left" title="Dock Left">◀</button>
                    <button class="tf-panel__btn" data-action="dock-right" title="Dock Right">▶</button>
                    <button class="tf-panel__btn" data-action="float" title="Float">⬜</button>
                    <button class="tf-panel__btn" data-action="minimize" title="Minimize">─</button>
                </div>
            </div>
            <div class="tf-tabs"></div>
            <div class="tf-panel__content tf-scroll"></div>
        </div>
        <div id="tf-bubble" class="tavern-forge tf-panel--bubble tf-hidden" title="Tavern Forge">⚒️</div>
    `;

    const container = $('#sheld').length ? $('#sheld') : $(document.body);
    container.append(html);

    panel$ = $('#tf-panel');
    bubble$ = $('#tf-bubble');

    const content$ = panel$.find('.tf-panel__content');
    const tabs$ = createTabs(content$);
    panel$.find('.tf-tabs').append(tabs$);

    setupEventListeners();
    setPanelMode(mode);

    return panel$;
}

function setupEventListeners() {
    panel$.find('.tf-panel__btn').on('click', (e) => {
        const action = $(e.currentTarget).data('action');
        switch (action) {
            case 'dock-left': setPanelMode(PANEL_MODE.LEFT_SIDEBAR); break;
            case 'dock-right': setPanelMode(PANEL_MODE.RIGHT_SIDEBAR); break;
            case 'float': setPanelMode(PANEL_MODE.FLOATING); break;
            case 'minimize': setPanelMode(PANEL_MODE.BUBBLE); break;
        }
    });

    bubble$.on('click', () => {
        const settings = getGlobalSettings();
        const lastMode = settings.lastNonBubbleMode || PANEL_MODE.FLOATING;
        setPanelMode(lastMode);
    });

    initDragging();
    initResizing();
}

/**
 * Switch between modes.
 * @param {string} mode Mode to switch to
 */
export function setPanelMode(mode) {
    if (!panel$) return;

    const settings = getGlobalSettings();
    if (mode !== PANEL_MODE.BUBBLE) {
        settings.lastNonBubbleMode = mode;
    }
    settings.panelMode = mode;
    // updateGlobalSettings takes a path and value, or we could just set it and save. But let's use the API correctly.
    updateGlobalSettings('panelMode', mode);
    if (mode !== PANEL_MODE.BUBBLE) {
        updateGlobalSettings('lastNonBubbleMode', mode);
    }

    panel$.removeClass('tf-panel--right-sidebar tf-panel--left-sidebar tf-panel--floating');
    
    if (mode === PANEL_MODE.BUBBLE) {
        panel$.addClass('tf-hidden');
        bubble$.removeClass('tf-hidden');
    } else {
        bubble$.addClass('tf-hidden');
        panel$.removeClass('tf-hidden');
        panel$.addClass(`tf-panel--${mode.toLowerCase().replace('_', '-')}`);
    }

    if (mode === PANEL_MODE.FLOATING) {
        // Reset styles for float
        panel$.css({ top: '100px', left: '100px', width: '300px', height: '400px' });
    } else {
        panel$.css({ top: '', left: '', width: '', height: '' });
    }
}

export function destroyPanel() {
    if (panel$) panel$.remove();
    if (bubble$) bubble$.remove();
    panel$ = null;
    bubble$ = null;
}

export function togglePanel() {
    if (panel$.hasClass('tf-hidden')) {
        const settings = getGlobalSettings();
        setPanelMode(settings.lastNonBubbleMode || PANEL_MODE.FLOATING);
    } else {
        setPanelMode(PANEL_MODE.BUBBLE);
    }
}

export function initDragging() {
    let startX, startY, startLeft, startTop;

    panel$.find('.tf-panel__header').on('mousedown', (e) => {
        const settings = getGlobalSettings();
        if (settings.panelMode !== PANEL_MODE.FLOATING) return;
        
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const pos = panel$.position();
        startLeft = pos.left;
        startTop = pos.top;
        
        $(document).on('mousemove.tf-drag', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            panel$.css({ left: startLeft + dx, top: startTop + dy });
        });
        
        $(document).on('mouseup.tf-drag', () => {
            isDragging = false;
            $(document).off('mousemove.tf-drag mouseup.tf-drag');
        });
    });
}

export function initResizing() {
    // Basic implementation for resizing left/right sidebar inner edge
    const resizeHandle = $('<div class="tf-resize-handle"></div>');
    panel$.append(resizeHandle);
    
    let startX, startWidth;
    
    resizeHandle.on('mousedown', (e) => {
        const settings = getGlobalSettings();
        if (settings.panelMode === PANEL_MODE.FLOATING || settings.panelMode === PANEL_MODE.BUBBLE) return;
        
        isResizing = true;
        startX = e.clientX;
        startWidth = panel$.width();
        
        $(document).on('mousemove.tf-resize', (e) => {
            if (!isResizing) return;
            const dx = e.clientX - startX;
            const newWidth = settings.panelMode === PANEL_MODE.RIGHT_SIDEBAR ? startWidth - dx : startWidth + dx;
            panel$.css('width', Math.max(200, newWidth) + 'px');
        });
        
        $(document).on('mouseup.tf-resize', () => {
            isResizing = false;
            $(document).off('mousemove.tf-resize mouseup.tf-resize');
        });
    });
}

export function refreshPanel() {
    if (!panel$) return;
    const currentTab = getActiveTab();
    setActiveTab(currentTab, true);
}

export function getPanelElement() {
    return panel$;
}
