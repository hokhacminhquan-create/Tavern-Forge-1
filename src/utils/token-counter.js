/**
 * @module token-counter
 * @description Token budget display and estimation.
 */

/**
 * Returns detailed token breakdown
 * @param {Object} chatState 
 * @param {Object} globalSettings 
 * @returns {Object}
 */
export function getTokenBreakdown(chatState, globalSettings) {
    // Dummy token estimation logic
    return {
        markerInstructions: 100,
        visualTypesList: 50,
        rpgStyleGuide: 200,
        statTags: 30,
        playerStats: 80,
        specialCharStats: 150,
        npcStats: 40,
        sceneState: 90,
        questLog: 120,
        total: 860
    };
}

/**
 * Returns warning message if total exceeds threshold
 * @param {number} total 
 * @param {number} threshold 
 * @returns {string|null}
 */
export function getTokenWarning(total, threshold) {
    if (total > threshold) {
        return `Warning: Token count (${total}) exceeds threshold (${threshold}).`;
    }
    return null;
}

/**
 * Format breakdown as readable string for display
 * @param {Object} breakdown 
 * @returns {string}
 */
export function formatTokenBreakdown(breakdown) {
    let result = 'Token Breakdown:\n';
    for (const [key, value] of Object.entries(breakdown)) {
        if (key !== 'total') {
            result += `- ${key}: ${value}\n`;
        }
    }
    result += `Total: ${breakdown.total}`;
    return result;
}
