import { escapeHtml } from '../../utils/helpers.js';

export function renderCombat(attributes, content) {
    let header = '<div class="tf-immersive__title">⚔️ Combat</div>';
    if (attributes.attacker && attributes.target) {
        header = `<div class="tf-immersive__title">⚔️ ${escapeHtml(attributes.attacker)} vs ${escapeHtml(attributes.target)}</div>`;
    }
    const result = attributes.result ? `<div class="tf-immersive__result">${escapeHtml(attributes.result)}</div>` : '';
    return `<div class="tf-immersive tf-immersive--combat">${header}<div class="tf-immersive__content">${escapeHtml(content)}</div>${result}</div>`;
}
