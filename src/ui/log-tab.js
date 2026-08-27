import { getChatState } from '../core/storage.js';

export function renderLogTab(container$) {
    const state = getChatState();
    const logs = state.undoLog || [];
    
    const wrapper = $('<div class="tf-log-tab"></div>');
    
    const header = $('<div class="tf-log-tab__header"></div>');
    header.append('<h2>History</h2>');
    header.append('<select class="tf-log-filter"><option value="all">All Characters</option></select>');
    header.append('<button class="tf-btn tf-log-clear">Clear Log</button>');
    wrapper.append(header);
    
    const list = $('<div class="tf-log-list"></div>');
    
    if (logs.length > 0) {
        // Render newest first
        [...logs].reverse().forEach(entry => {
            list.append(renderLogEntry(entry));
        });
    } else {
        list.append('<p>No stat changes logged yet.</p>');
    }
    
    wrapper.append(list);
    container$.append(wrapper);
}

export function renderLogEntry(entry) {
    const el = $(`<div class="tf-log__entry"></div>`);
    if (entry.flagged) el.addClass('tf-log__entry--flagged');
    if (entry.undone) el.addClass('tf-log__entry--undone');
    
    el.append(`
        <div class="tf-log__meta">Turn ${entry.turn} • ${entry.character}</div>
        <div class="tf-log__change">${entry.field}: ${entry.oldValue} ➔ ${entry.newValue}</div>
        <button class="tf-btn tf-btn--small tf-log__undo-btn">Undo</button>
    `);
    
    return el;
}
