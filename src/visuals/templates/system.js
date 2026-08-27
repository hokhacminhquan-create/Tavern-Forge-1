import { escapeHtml } from '../../utils/helpers.js';

export function renderSystem(attributes, content) {
    const icon = attributes.icon ? escapeHtml(attributes.icon) : '⚡';
    const title = attributes.title ? escapeHtml(attributes.title) : 'System';
    return `<div class="tf-immersive tf-immersive--system"><div class="tf-immersive__title">${icon} ${title}</div><div class="tf-immersive__content">${escapeHtml(content)}</div></div>`;
}
