import { escapeHtml } from '../../utils/helpers.js';

export function renderCheck(attributes, content) {
    const skill = attributes.skill ? escapeHtml(attributes.skill) : 'Skill Check';
    const result = attributes.result ? escapeHtml(attributes.result) : '';
    const dc = attributes.dc ? ` DC ${escapeHtml(attributes.dc)}` : '';
    const roll = attributes.roll ? ` [Roll: ${escapeHtml(attributes.roll)}]` : '';
    return `<div class="tf-immersive tf-immersive--check"><div class="tf-immersive__title">🎲 ${skill}${dc}</div><div class="tf-immersive__content">${escapeHtml(content)}</div><div class="tf-immersive__result">${result}${roll}</div></div>`;
}
