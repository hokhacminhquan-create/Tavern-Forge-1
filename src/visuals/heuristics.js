/**
 * Fallback pattern detection.
 */

export function detectVisualHints(messageText) {
    if (!messageText) return [];
    
    const suggestions = [];
    const lowerText = messageText.toLowerCase();
    
    const patterns = [
        { type: 'book', regex: /(you read:|you open the book|the tome says|the pages read)/i, conf: 0.7 },
        { type: 'sign', regex: /(the sign reads|the signpost says|posted on the board)/i, conf: 0.7 },
        { type: 'letter', regex: /(the letter says|the note reads|you unfold the letter)/i, conf: 0.7 },
        { type: 'scroll', regex: /(the scroll contains|the scroll reads|ancient writings)/i, conf: 0.7 },
        { type: 'inscription', regex: /(carved into the stone|the inscription reads|engraved)/i, conf: 0.7 },
        { type: 'recipe', regex: /(the recipe calls for|ingredients:|to craft this)/i, conf: 0.7 }
    ];
    
    patterns.forEach(p => {
        const match = messageText.match(p.regex);
        if (match) {
            suggestions.push({
                type: p.type,
                confidence: p.conf,
                matchedPattern: match[0],
                startIndex: match.index,
                suggestedContent: '' // Requires NLP to fully extract
            });
        }
    });
    
    return suggestions.filter(s => s.confidence > 0.6);
}
