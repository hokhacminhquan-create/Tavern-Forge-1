import { escapeHtml } from '../../utils/helpers.js';

export function renderPoster(attributes, content) {
    const title = attributes.title ? escapeHtml(attributes.title) : 'Notice';
    const reward = attributes.reward ? `<div class="tf-immersive__reward">Reward: ${escapeHtml(attributes.reward)}</div>` : '';
    return `<div class="tf-immersive tf-immersive--poster"><div class="tf-immersive__title">📋 ${title}</div><div class="tf-immersive__content">${escapeHtml(content)}</div>${reward}</div>`;
}
