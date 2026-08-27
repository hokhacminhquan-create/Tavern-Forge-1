import { escapeHtml } from '../../utils/helpers.js';

export function renderBook(attributes, content) {
    const title = attributes.title ? `<div class="tf-immersive__title">📖 ${escapeHtml(attributes.title)}</div>` : '';
    return `<div class="tf-immersive tf-immersive--book">${title}<div class="tf-immersive__content">${escapeHtml(content)}</div></div>`;
}
