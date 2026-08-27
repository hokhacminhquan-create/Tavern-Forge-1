import { getGlobalSettings } from '../core/storage.js';
import { renderStatsTab } from './stats-tab.js';
import { renderSceneTab } from './scene-tab.js';
import { renderQuestsTab } from './quests-tab.js';
import { renderLogTab } from './log-tab.js';

let activeTab = 'scene';
let tabContainer$ = null;
let contentContainer$ = null;

const TABS = [
    { id: 'scene', label: 'Scene', icon: '📍', renderer: renderSceneTab },
    { id: 'stats', label: 'Stats', icon: '⚔️', renderer: renderStatsTab },
    { id: 'quests', label: 'Quests', icon: '📋', renderer: renderQuestsTab },
    { id: 'log', label: 'Log', icon: '📜', renderer: renderLogTab }
];

export function createTabs(content$) {
    contentContainer$ = content$;
    tabContainer$ = $('<div class="tf-tabs__bar"></div>');
    
    TABS.forEach(tab => {
        const btn = $(`<button class="tf-tab-btn" data-tab="${tab.id}" title="${tab.label}">${tab.icon} ${tab.label}</button>`);
        btn.on('click', () => setActiveTab(tab.id));
        tabContainer$.append(btn);
    });

    setActiveTab(activeTab);
    return tabContainer$;
}

export function setActiveTab(tabId, forceRefresh = false) {
    if (!forceRefresh && activeTab === tabId && contentContainer$.children().length > 0) return;
    activeTab = tabId;
    
    tabContainer$.find('.tf-tab-btn').removeClass('active');
    tabContainer$.find(`.tf-tab-btn[data-tab="${tabId}"]`).addClass('active');
    
    contentContainer$.empty();
    
    const tabDef = TABS.find(t => t.id === tabId);
    if (tabDef) {
        tabDef.renderer(contentContainer$);
    }
}

export function getActiveTab() {
    return activeTab;
}

export function registerKeyboardShortcuts() {
    $(document).on('keydown.tf-tabs', (e) => {
        const settings = getGlobalSettings();
        const bindings = settings.keybindings || {
            '1': 'scene', '2': 'stats', '3': 'quests', '4': 'log'
        };
        
        if (e.altKey && bindings[e.key]) {
            e.preventDefault();
            setActiveTab(bindings[e.key]);
        }
    });
}

export function unregisterKeyboardShortcuts() {
    $(document).off('keydown.tf-tabs');
}
