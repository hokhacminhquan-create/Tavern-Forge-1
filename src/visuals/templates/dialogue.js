import { escapeHtml } from '../../utils/helpers.js';

export function renderDialogue(attributes, content) {
    const character = attributes.character ? escapeHtml(attributes.character) : 'Unknown';
    return `<div class="tf-immersive tf-immersive--dialogue"><div class="tf-immersive__title">💬 ${character}</div><div class="tf-immersive__content">${escapeHtml(content)}</div></div>`;
}
