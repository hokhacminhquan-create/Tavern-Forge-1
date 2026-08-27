import { getBarVariables } from '../stats/schema.js';

export function createColorPicker(label, currentColor, onChange) {
    const wrapper = $('<div class="tf-color-picker"></div>');
    const input = $(`<input type="color" value="${currentColor}">`);
    wrapper.append(`<span>${label}</span>`);
    wrapper.append(input);
    
    input.on('change', (e) => onChange(e.target.value));
    return wrapper;
}

export function createBarColorPickers(schema, currentColors, onChange) {
    const wrapper = $('<div class="tf-bar-colors"></div>');
    if (!schema) return wrapper;
    
    const barVars = getBarVariables(schema);
    
    barVars.forEach(v => {
        const color = currentColors[v.tag] || v.color || '#cccccc';
        const picker = createColorPicker(v.name, color, (newVal) => {
            onChange(v.tag, newVal);
        });
        wrapper.append(picker);
    });
    return wrapper;
}

export function applyColors(colors) {
    const root = document.querySelector('.tavern-forge');
    if (!root) return;
    if (colors.bg) root.style.setProperty('--tf-bg', colors.bg);
    if (colors.text) root.style.setProperty('--tf-text', colors.text);
    if (colors.accent) root.style.setProperty('--tf-accent', colors.accent);
}

export function getDefaultColors(presetName) {
    switch (presetName) {
        case 'SciFi': return { bg: '#0d1b2a', text: '#e0e1dd', accent: '#00b4d8' };
        case 'Fantasy': return { bg: '#281c1c', text: '#f3e5ab', accent: '#d4af37' };
        default: return { bg: '#1e1e1e', text: '#ffffff', accent: '#4caf50' };
    }
}
