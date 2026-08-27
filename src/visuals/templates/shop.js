import { escapeHtml } from '../../utils/helpers.js';

export function renderShop(attributes, content) {
    const shopName = attributes.shop_name ? escapeHtml(attributes.shop_name) : 'Shop';
    const lines = content.split('\\n').map(line => `<div>${escapeHtml(line.trim())}</div>`).join('');
    return `<div class="tf-immersive tf-immersive--shop"><div class="tf-immersive__title">🏪 ${shopName}</div><div class="tf-immersive__content">${lines}</div></div>`;
}
