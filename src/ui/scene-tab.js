import { getChatState } from '../core/storage.js';
import { getCharacterByName } from '../stats/characters.js';
import { escapeHtml } from '../utils/helpers.js';

export function renderSceneTab(container$) {
    const state = getChatState();
    const scene = state.scene || { location: 'Unknown Location', time: 'Unknown Time', characters: [] };
    
    const wrapper = $('<div class="tf-scene-tab"></div>');
    
    // Location
    wrapper.append(`<div class="tf-scene__location">🗺️ ${escapeHtml(scene.location || 'Unknown')}</div>`);
    if (scene.time) {
        wrapper.append(`<div class="tf-scene__time">🕒 ${escapeHtml(scene.time)}</div>`);
    }

    // Characters present
    const chars$ = $('<div class="tf-scene__characters"></div>');
    chars$.append('<h3>Present Characters</h3>');
    
    if (scene.characters && scene.characters.length > 0) {
        const badges$ = $('<div class="tf-scene__badges"></div>');
        scene.characters.forEach(charName => {
            const charObj = getCharacterByName(state, charName);
            let icon = '🧙'; // default NPC
            let displayType = 'npc';
            
            if (charObj) {
                if (charObj.type === 'player') icon = '⚔️';
                else if (charObj.type === 'special') icon = '⭐';
                else if (charObj.type === 'enemy') icon = '💀';
                displayType = charObj.type;
            }
            
            // HP status dot logic
            let dotColor = 'gray'; // unknown
            if (charObj && charObj.values && charObj.values['HP'] !== undefined && charObj.maxValues && charObj.maxValues['HP']) {
                const pct = charObj.values['HP'] / charObj.maxValues['HP'];
                if (pct > 0.5) dotColor = 'green';
                else if (pct > 0.2) dotColor = 'yellow';
                else dotColor = 'red';
            }
            
            badges$.append(`
                <div class="tf-scene__char-badge tf-scene__char-badge--${displayType}" title="${escapeHtml(charName)}">
                    <span class="tf-scene__char-icon">${icon}</span>
                    <span class="tf-scene__char-name">${escapeHtml(charName)}</span>
                    <span class="tf-scene__char-dot" style="background-color: ${dotColor};"></span>
                </div>
            `);
        });
        chars$.append(badges$);
    } else {
        chars$.append('<p>No characters detected.</p>');
    }
    wrapper.append(chars$);

    // Stakes / Quests
    const quests$ = $('<div class="tf-scene__stakes"></div>');
    quests$.append('<h3>Active Stakes</h3>');
    if (state.questLog && state.questLog.length > 0) {
        const activeQuests = state.questLog.filter(q => q.status === 'active');
        if (activeQuests.length) {
            const ul = $('<ul></ul>');
            activeQuests.forEach(q => ul.append(`<li>${escapeHtml(q.title || 'Unknown Quest')}</li>`));
            quests$.append(ul);
        } else {
            quests$.append('<p>No active stakes.</p>');
        }
    } else {
        quests$.append('<p>No active stakes.</p>');
    }
    wrapper.append(quests$);

    // Controls
    const controls$ = $('<div class="tf-scene__controls"></div>');
    controls$.append('<button class="tf-btn">Detect Scene</button>');
    wrapper.append(controls$);

    container$.append(wrapper);
}
