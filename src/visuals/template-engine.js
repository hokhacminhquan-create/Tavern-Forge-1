/**
 * Template registry and rendering engine.
 */

const templates = {};

export function registerTemplate(typeName, renderFn) {
    templates[typeName] = renderFn;
}

export function getTemplate(typeName) {
    return templates[typeName];
}

export function renderVisualElement(element) {
    if (!element) return '';
    const { type, attributes = {}, content = '' } = element;
    const renderFn = templates[type];
    
    if (renderFn) {
        return renderFn(attributes, content);
    }
    
    const safeContent = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<div class="tf-immersive tf-immersive--generic"><div class="tf-immersive__content">${safeContent}</div></div>`;
}

export async function registerAllTemplates() {
    const types = [
        'book', 'scroll', 'letter', 'system', 'combat', 'shop', 
        'dialogue', 'poster', 'check', 'status', 'area', 
        'achievement', 'inscription', 'sign', 'recipe'
    ];
    
    for (const type of types) {
        try {
            const module = await import(`./templates/${type}.js`);
            const renderFnName = `render${type.charAt(0).toUpperCase() + type.slice(1)}`;
            if (module[renderFnName]) {
                registerTemplate(type, module[renderFnName]);
            }
        } catch (e) {
            console.error(`Failed to load template ${type}:`, e);
        }
    }
}

export function getRegisteredTypes() {
    return Object.keys(templates);
}
