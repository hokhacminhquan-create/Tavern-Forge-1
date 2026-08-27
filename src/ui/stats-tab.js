import { getChatState, getGlobalSettings } from '../core/storage.js';
import { getSchema, getBarVariables } from '../stats/schema.js';
import { escapeHtml } from '../utils/helpers.js';

export function renderStatsTab(container$) {
    const state = getChatState();
    const schema = getSchema(state);
    
    const statsContainer = $('<div class="tf-stats-tab"></div>');
    
    if (state.characters && state.characters.length > 0) {
        state.characters.forEach(char => {
            const isPlayer = char.type === 'player';
            const isSpecial = char.type === 'special';
            const isNPC = char.type === 'npc';
            const simplified = isNPC;
            
            const card$ = renderCharacterCard(char, schema, simplified);
            if (isPlayer) card$.addClass('tf-character-card--player');
            else if (isSpecial) card$.addClass('tf-character-card--special');
            else card$.addClass('tf-character-card--npc');
            
            statsContainer.append(card$);
        });
    } else {
        statsContainer.append('<p>No character data available.</p>');
    }
    
    container$.append(statsContainer);
}

export function renderCharacterCard(character, schema, simplified) {
    const card$ = $('<div class="tf-character-card"></div>');
    const badge = character.type === 'special' ? ' ★' : '';
    card$.append(`<div class="tf-character-card__header">${escapeHtml(character.name)}${badge}</div>`);
    
    // Identity fields are stored in character.values via their tags
    const charClass = character.values['Class'];
    const charRace = character.values['Race'];
    const charGender = character.values['Gender'];
    const charLevel = character.values['Level'];
    
    const identityStr = [charClass, charRace, charGender, charLevel ? `Lvl ${charLevel}` : ''].filter(Boolean).join(' • ');
    if (identityStr) {
        card$.append(`<div class="tf-character-card__identity">${escapeHtml(identityStr)}</div>`);
    }

    const barVariables = getBarVariables(schema);
    if (barVariables.length > 0) {
        const bars$ = $('<div class="tf-character-card__bars"></div>');
        barVariables.forEach(v => {
            if (character.values[v.tag] !== undefined) {
                const current = character.values[v.tag];
                const max = character.maxValues[v.tag] || current; // fallback if max isn't set
                bars$.append(renderStatBar(v.name, current, max, v.color || '#4caf50'));
            }
        });
        card$.append(bars$);
    }
    
    if (!simplified) {
        card$.append(renderStatGrid(character, schema));
        
        // Sections
        if (character.skills && character.skills.length) card$.append(renderSection('Skills', character.skills));
        if (character.passives && character.passives.length) card$.append(renderSection('Passives', character.passives));
        if (character.inventory && character.inventory.length) card$.append(renderSection('Inventory', character.inventory));
        
        if (character.equipment && Object.keys(character.equipment).length) {
            const eqList = Object.entries(character.equipment).map(([slot, item]) => `${slot}: ${item.name || item}`);
            card$.append(renderSection('Equipment', eqList));
        }
        
        if (character.statusEffects && character.statusEffects.length) {
            card$.append(renderSection('Status Effects', character.statusEffects));
        }
    } else {
        // Simplified view might still want to show status effects
        if (character.statusEffects && character.statusEffects.length) {
            card$.append(renderSection('Status Effects', character.statusEffects));
        }
    }
    
    return card$;
}

export function renderStatBar(variable, currentValue, maxValue, color) {
    const pct = maxValue > 0 ? Math.min(100, Math.max(0, (Number(currentValue) / Number(maxValue)) * 100)) : 0;
    return `
        <div class="tf-stat-bar">
            <div class="tf-stat-bar__label">${escapeHtml(String(variable))}</div>
            <div class="tf-stat-bar__track">
                <div class="tf-stat-bar__fill" style="width: ${pct}%; background-color: ${color};"></div>
            </div>
            <div class="tf-stat-bar__value">${escapeHtml(String(currentValue))}/${escapeHtml(String(maxValue))}</div>
        </div>
    `;
}

export function renderStatGrid(character, schema) {
    const grid$ = $('<div class="tf-stat-grid"></div>');
    
    // We want to show numbers that aren't bars and aren't identity base fields
    const gridVars = schema.variables.filter(v => 
        v.type === 'number' && 
        !v.showBar && 
        !['Level'].includes(v.tag)
    );
    
    if (gridVars.length > 0) {
        gridVars.forEach(v => {
            const val = character.values[v.tag];
            if (val !== undefined) {
                grid$.append(`<div class="tf-stat-grid__item"><span class="tf-stat-grid__label">${escapeHtml(v.name)}</span>: <span class="tf-stat-grid__value">${escapeHtml(String(val))}</span></div>`);
            }
        });
    }
    
    return grid$;
}

export function renderSection(title, items) {
    const section$ = $('<div class="tf-section"></div>');
    const header$ = $(`<div class="tf-section__header">${escapeHtml(title)}</div>`);
    const content$ = $('<div class="tf-section__content"></div>');
    
    header$.on('click', () => content$.slideToggle());
    section$.append(header$, content$);
    
    if (Array.isArray(items) && items.length > 0) {
        const ul = $('<ul></ul>');
        items.forEach(item => {
            const text = typeof item === 'object' ? (item.name || JSON.stringify(item)) : item;
            ul.append(`<li>${escapeHtml(String(text))}</li>`);
        });
        content$.append(ul);
    } else {
        content$.append('<p>None</p>');
    }
    return section$;
}
