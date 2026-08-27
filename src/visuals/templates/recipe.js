import { escapeHtml } from '../../utils/helpers.js';

export function renderRecipe(attributes, content) {
    const name = attributes.name ? escapeHtml(attributes.name) : 'Recipe';
    const type = attributes.type ? escapeHtml(attributes.type) : 'crafting';
    const lines = content.split('\\n').map(line => `<div>${escapeHtml(line.trim())}</div>`).join('');
    return `<div class="tf-immersive tf-immersive--recipe tf-immersive--${type}"><div class="tf-immersive__title">📝 ${name}</div><div class="tf-immersive__content">${lines}</div></div>`;
}
