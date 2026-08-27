import { escapeHtml } from '../../utils/helpers.js';

export function renderArea(attributes, content) {
    const location = attributes.location ? escapeHtml(attributes.location) : 'New Area';
    return `<div class="tf-immersive tf-immersive--area"><div class="tf-immersive__title">📍 ${location}</div><div class="tf-immersive__content">${escapeHtml(content)}</div></div>`;
}
