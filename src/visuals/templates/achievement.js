import { escapeHtml } from '../../utils/helpers.js';

export function renderAchievement(attributes, content) {
    const title = attributes.title ? escapeHtml(attributes.title) : 'Achievement Unlocked';
    return `<div class="tf-immersive tf-immersive--achievement"><div class="tf-immersive__title">🏆 ${title}</div><div class="tf-immersive__content">${escapeHtml(content)}</div></div>`;
}
