import { escapeHtml } from '../../utils/helpers.js';

export function renderScroll(attributes, content) {
    const spellName = attributes.spell_name ? `<div class="tf-immersive__title">📜 ${escapeHtml(attributes.spell_name)}</div>` : '<div class="tf-immersive__title">📜 Scroll</div>';
    return `<div class="tf-immersive tf-immersive--scroll">${spellName}<div class="tf-immersive__content">${escapeHtml(content)}</div></div>`;
}
