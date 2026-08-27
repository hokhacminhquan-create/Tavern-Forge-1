import { escapeHtml } from '../../utils/helpers.js';

export function renderLetter(attributes, content) {
    let header = '<div class="tf-immersive__title">✉️ Letter</div>';
    if (attributes.from || attributes.to) {
        const from = attributes.from ? `From: ${escapeHtml(attributes.from)}` : '';
        const to = attributes.to ? `To: ${escapeHtml(attributes.to)}` : '';
        header = `<div class="tf-immersive__title">✉️ ${from} ${to ? (from ? '| ' : '') + to : ''}</div>`;
    }
    return `<div class="tf-immersive tf-immersive--letter">${header}<div class="tf-immersive__content">${escapeHtml(content)}</div></div>`;
}
