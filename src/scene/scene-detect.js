/**
 * Fallback scene detection.
 */

export async function detectCurrentScene(recentMessages) {
    const context = window.SillyTavern?.getContext?.();
    if (!context || !context.generateQuietPrompt) return null;
    
    const prompt = buildDetectionPrompt(recentMessages);
    try {
        const responseText = await context.generateQuietPrompt(prompt, false, false);
        return parseDetectionResponse(responseText);
    } catch (e) {
        console.error('Scene detection failed:', e);
        return null;
    }
}

export function buildDetectionPrompt(recentMessages) {
    const messagesText = recentMessages.map(m => `${m.name || 'Unknown'}: ${m.mes}`).join('\n');
    return `Based on the following recent conversation, extract the current scene state.
Return ONLY a JSON object with these fields:
{"location": "...", "characters": ["..."], "time": "...", "weather": "..."}
Do not include any other text, markdown formatting, or explanations.

Conversation:
${messagesText}`;
}

export function parseDetectionResponse(responseText) {
    try {
        const cleanText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanText);
        
        return {
            location: parsed.location || '',
            characters: Array.isArray(parsed.characters) ? parsed.characters : [],
            time: parsed.time || '',
            weather: parsed.weather || ''
        };
    } catch (e) {
        console.error('Failed to parse scene detection response:', e);
        return null;
    }
}
