/**
 * Helper utilities for Tavern Forge.
 */

/**
 * Console logger with prefix.
 */
export function log(level, ...args) {
    const prefix = '[Tavern Forge]';
    if (level === 'error') console.error(prefix, ...args);
    else if (level === 'warn') console.warn(prefix, ...args);
    else if (level === 'debug') console.debug(prefix, ...args);
    else console.log(prefix, ...args);
}

/**
 * Simple debounce function.
 */
export function debounce(fn, ms) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), ms);
    };
}

/**
 * Deep clones an object.
 */
export function deepClone(obj) {
    if (typeof structuredClone === 'function') {
        try {
            return structuredClone(obj);
        } catch(e) {}
    }
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Sets a value at a dot-notation path.
 */
export function setNestedValue(obj, path, value) {
    if (!obj || typeof obj !== 'object' || !path) return;
    const parts = path.split('.');
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
}

/**
 * Gets a value at a dot-notation path.
 */
export function getNestedValue(obj, path, defaultValue = undefined) {
    if (!obj || typeof obj !== 'object' || !path) return defaultValue;
    const parts = path.split('.');
    let current = obj;
    for (let i = 0; i < parts.length; i++) {
        if (current[parts[i]] === undefined) return defaultValue;
        current = current[parts[i]];
    }
    return current;
}

/**
 * Generates a short unique ID with optional prefix.
 * @param {string} [prefix=''] - Optional prefix (e.g., 'char_', 'var_')
 * @returns {string}
 */
export function generateId(prefix = '') {
    return prefix + Math.random().toString(36).substring(2, 9);
}

/**
 * Escapes HTML characters.
 */
export function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/[&<>"']/g, match => {
        const escape = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return escape[match];
    });
}

/**
 * Sanitizes marker values (escapes pipes and colons).
 */
export function sanitizeMarkerValue(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/\|/g, '&#124;').replace(/:/g, '&#58;');
}

/**
 * Formats a timestamp for display.
 */
export function formatTimestamp(date) {
    if (!(date instanceof Date)) date = new Date(date);
    return date.toLocaleString();
}

/**
 * Rough token estimation (chars / 4).
 */
export function estimateTokens(text) {
    if (!text || typeof text !== 'string') return 0;
    return Math.ceil(text.length / 4);
}
