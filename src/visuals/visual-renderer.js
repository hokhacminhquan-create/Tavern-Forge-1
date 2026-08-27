/**
 * DOM injection for visuals.
 */

import { renderVisualElement } from './template-engine.js';

export function renderMessageVisuals(messageId) {
    const context = window.SillyTavern?.getContext?.();
    if (!context) return;
    
    const chat = context.chat || [];
    const msg = chat.find(m => m._id === messageId || m.id === messageId || (m.mesid && m.mesid == messageId));
    if (!msg || !msg.extra || !msg.extra.tavern_forge || !msg.extra.tavern_forge.immersiveElements) {
        return;
    }
    
    const elements = msg.extra.tavern_forge.immersiveElements;
    const $messageEl = $(`#chat .mes[mesid="${messageId}"]`);
    if (!$messageEl.length) return;
    
    const $textContainer = $messageEl.find('.mes_text');
    if (!$textContainer.length) return;
    
    let htmlContent = $textContainer.html();
    
    elements.forEach(element => {
        const renderedHtml = renderVisualElement(element);
        const safeContent = element.content;
        
        // Escape regex characters to safely use content in regex
        const escapedContent = safeContent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Allow for optional HTML tags (like <br>, <em>) breaking up the text
        const flexiblePattern = escapedContent.split(/\\s+/).join('(?:\\s|<[^>]+>)*');
        
        try {
            const regex = new RegExp(flexiblePattern);
            if (regex.test(htmlContent)) {
                htmlContent = htmlContent.replace(regex, renderedHtml);
            } else {
                htmlContent += `\n<br>\n` + renderedHtml;
            }
        } catch(e) {
            // Fallback if regex generation fails
            if (htmlContent.includes(safeContent)) {
                 htmlContent = htmlContent.replace(safeContent, renderedHtml);
            } else {
                 htmlContent += `\n<br>\n` + renderedHtml;
            }
        }
    });
    
    $textContainer.html(htmlContent);
}

export function reRenderAllVisuals() {
    $('#chat .mes').each(function() {
        const mesid = $(this).attr('mesid');
        if (mesid) {
            renderMessageVisuals(mesid);
        }
    });
}
