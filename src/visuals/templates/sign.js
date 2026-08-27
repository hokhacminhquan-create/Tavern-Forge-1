import { escapeHtml } from '../../utils/helpers.js';

export function renderSign(attributes, content) {
    return `<div class="tf-immersive tf-immersive--sign"><div class="tf-immersive__title">🪧 Sign</div><div class="tf-immersive__content">${escapeHtml(content)}</div></div>`;
}
