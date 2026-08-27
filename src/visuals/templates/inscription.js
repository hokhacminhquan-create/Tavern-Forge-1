import { escapeHtml } from '../../utils/helpers.js';

export function renderInscription(attributes, content) {
    const material = attributes.material ? escapeHtml(attributes.material) : 'stone';
    return `<div class="tf-immersive tf-immersive--inscription tf-immersive--${material}"><div class="tf-immersive__title">🪨 Inscription</div><div class="tf-immersive__content">${escapeHtml(content)}</div></div>`;
}
