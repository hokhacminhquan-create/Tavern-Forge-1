import { escapeHtml } from '../../utils/helpers.js';

export function renderStatus(attributes, content) {
    const type = attributes.type === 'debuff' ? 'debuff' : 'buff';
    const icon = type === 'debuff' ? '🔻' : '🔺';
    const effect = attributes.effect ? escapeHtml(attributes.effect) : 'Status Effect';
    return `<div class="tf-immersive tf-immersive--status tf-immersive--${type}"><div class="tf-immersive__title">${icon} ${effect}</div><div class="tf-immersive__content">${escapeHtml(content)}</div></div>`;
}
