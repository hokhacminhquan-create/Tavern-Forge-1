/**
 * Prompt Engine for Tavern Forge.
 * Builds and injects the system prompt with current game state.
 */

import { MODULE_KEY, PROMPT_POSITION, PROMPT_ROLE, MARKER_PREFIX, VISUAL_TYPES } from './constants.js';
import { estimateTokens, log } from '../utils/helpers.js';
import { getPlayerCharacter, getAllCharacters, characterToPromptLine } from '../stats/characters.js';
import { getSchema, getAllTags } from '../stats/schema.js';
import { getPromptRelevantCharacters } from '../stats/tracking-mode.js';

/**
 * Estimates token count roughly.
 * @param {string} prompt
 * @returns {number}
 */
export function estimateTokenCount(prompt) {
    return estimateTokens(prompt);
}

/**
 * Builds the full system prompt string based on current state.
 * @param {Object} chatState - Chat-specific state from chatMetadata
 * @param {Object} globalSettings - Global extension settings
 * @returns {string}
 */
export function buildSystemPrompt(chatState, globalSettings) {
    const schema = getSchema(chatState);
    const tags = getAllTags(schema);
    const visualTypes = Object.values(VISUAL_TYPES).join(', ');

    let prompt = `[TAVERN FORGE — RPG IMMERSION ENGINE]\n`;
    prompt += `You are in an RPG-enhanced roleplay. Use invisible markers to control game state.\n\n`;

    // Marker instructions
    prompt += `MARKERS (output these exactly, they are invisible to the user):\n`;
    prompt += `- Visual: <!--${MARKER_PREFIX}-imm:TYPE|key:value-->content<!--/${MARKER_PREFIX}-imm-->\n`;
    prompt += `  Types: ${visualTypes}\n`;
    prompt += `- Scene change: <!--${MARKER_PREFIX}-scene:location:NAME|characters:A,B,C|time:TIME-->\n`;
    prompt += `- Stat change: <!--${MARKER_PREFIX}-rpg:TARGET|FIELD+VALUE|FIELD-VALUE|FIELD=VALUE-->\n`;
    prompt += `  Targets: 'player' or 'npc:CharacterName'\n`;
    prompt += `- Quest: <!--${MARKER_PREFIX}-quest:ACTION|id:ID|title:TITLE-->\n`;
    prompt += `  Actions: add, complete, fail, update\n\n`;

    // RPG writing style
    prompt += `STYLE: Integrate RPG mechanics naturally in parentheses.\n`;
    prompt += `Examples: "(-12 HP)", "(Fireball Lv3 — 28 damage | -15 MP)", "(Level Up! 4→5)"\n\n`;

    // Available stat tags
    prompt += `STAT TAGS: ${tags.join(', ')}\n\n`;

    // Current state block
    prompt += `CURRENT STATE:\n`;

    // Scene
    if (chatState.scene && chatState.scene.location) {
        prompt += `Location: ${chatState.scene.location}`;
        if (chatState.scene.time) prompt += ` | Time: ${chatState.scene.time}`;
        if (chatState.scene.characters && chatState.scene.characters.length > 0) {
            prompt += ` | Present: ${chatState.scene.characters.join(', ')}`;
        }
        prompt += `\n`;
    }

    // Characters — use tracking mode to determine detail level
    try {
        const { fullCharacters, simplifiedCharacters } = getPromptRelevantCharacters(chatState, schema);

        for (const char of fullCharacters) {
            prompt += characterToPromptLine(char, schema, false) + `\n`;
        }
        for (const char of simplifiedCharacters) {
            prompt += characterToPromptLine(char, schema, true) + `\n`;
        }
    } catch (e) {
        // Fallback: just list all characters simply
        const allChars = getAllCharacters(chatState);
        for (const char of allChars) {
            prompt += characterToPromptLine(char, schema, char.type === 'npc') + `\n`;
        }
    }

    // Quest log
    if (chatState.questLog && chatState.questLog.length > 0) {
        const activeQuests = chatState.questLog.filter(q => q.status === 'active');
        if (activeQuests.length > 0) {
            prompt += `Active Quests: ${activeQuests.map(q => q.title || q.name).join(', ')}\n`;
        }
    }

    return prompt.trim();
}

/**
 * Injects the built prompt into SillyTavern's context.
 * @param {Object} chatState
 * @param {Object} globalSettings
 */
export function injectPrompt(chatState, globalSettings) {
    try {
        const context = window.SillyTavern?.getContext?.();
        if (!context || !context.setExtensionPrompt) return;

        const promptText = buildSystemPrompt(chatState, globalSettings);
        // id, text, position, depth, allowWIScan, role
        context.setExtensionPrompt(MODULE_KEY, promptText, PROMPT_POSITION, 1, false, PROMPT_ROLE);
        log('debug', `Prompt injected (${estimateTokenCount(promptText)} est. tokens)`);
    } catch (e) {
        log('error', 'Error injecting prompt', e);
    }
}

/**
 * Clears the injected prompt.
 */
export function clearPrompt() {
    try {
        const context = window.SillyTavern?.getContext?.();
        if (!context || !context.setExtensionPrompt) return;
        context.setExtensionPrompt(MODULE_KEY, '', PROMPT_POSITION, 1, false, PROMPT_ROLE);
    } catch (e) {
        log('error', 'Error clearing prompt', e);
    }
}
