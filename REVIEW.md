# Tavern Forge Code Review Report

This document contains a comprehensive review of all 17 files in the Tavern Forge extension, focusing on import paths, data structure consistency, API alignment, and SillyTavern API usage.

## CRITICAL (Will cause crashes or complete failure)

1. **ES Module / Browser Compatibility (`src/stats/schema.js`)**
   - **Line 42**: Uses CommonJS `require('./presets.js')`. This will throw a `ReferenceError` in the browser because `require` is not defined in ES modules.
   - **Fix**: Remove the dynamic require and import `applyPreset` using standard ES module syntax at the top of the file, being careful to manage the circular dependency between `schema.js` and `presets.js`.

2. **Parser Output vs Delta Processor Mismatch (`src/stats/delta-processor.js`)**
   - **Line 17-31**: `processStatChanges` loops over `statChanges` assuming each `change` is a flat object with `change.tag`, `change.value`, and `change.operation`. However, `parser.js` returns an array of objects structured as `{ target, changes: [{ field, delta, operation }] }`.
   - **Fix**: Add a nested loop to iterate through `statChange.changes`. Map `field` to `tag` and `delta` to `value` when calling `applyDelta`.

3. **Data Structure Mismatch: `chatState.characters` (`src/core/prompt-engine.js`)**
   - **Line 65**: Assumes `chatState.characters` is an object mapping (e.g., `chatState.characters.player`). In `characters.js`, `chatState.characters` is strictly maintained as an Array.
   - **Fix**: Import and use `getPlayerCharacter(chatState)` from `characters.js` instead of directly accessing the array as an object map.

4. **Data Structure Mismatch: Character Stats (`src/core/prompt-engine.js`)**
   - **Line 15-30**: `buildCompressedStatBlock` accesses stats via `character.stats.HP` and `character.status`. However, `characters.js` defines the structure using `character.values` and `character.statusEffects`.
   - **Fix**: Update the references to match the `CharacterState` object structure created in `characters.js`. (Note: This function should ideally be replaced entirely, see MAJOR section below).

5. **Missing Functionality: Stat Processing (`src/core/events.js`)**
   - **Line 37-41**: The event hook successfully parses markers and extracts stat changes, but it NEVER calls `processStatChanges`. It only logs them with a `// TODO: Route to stat manager`. 
   - **Fix**: Import `processStatChanges` from `delta-processor.js` and call it with the extracted `result.statChanges`, current chat state, and schema, then call `updateChatState()` with the result.

## MAJOR (Will cause specific features to break or misbehave)

1. **Reinventing the Wheel (`src/core/prompt-engine.js`)**
   - **Line 11**: The prompt engine implements its own `buildCompressedStatBlock()` function to serialize characters into prompt text. It fails to call `characterToPromptLine()` from `characters.js` which is the designated function for this purpose and correctly references the schema and correct property names.
   - **Fix**: Remove `buildCompressedStatBlock` and import/use `characterToPromptLine(character, schema, false)` from `characters.js`.

2. **Ignored Function Arguments (`src/utils/helpers.js`)**
   - **Line 70**: `export function generateId()` accepts no arguments. However, `characters.js`, `schema.js`, `undo-log.js`, and `presets.js` all pass a prefix string (e.g., `generateId('char_')`). The prefix is silently ignored, making debugging ID origins very difficult.
   - **Fix**: Update the signature to `export function generateId(prefix = '')` and prepend the prefix to the returned string.

3. **Incorrect SillyTavern API Usage (`src/core/storage.js`)**
   - **Line 27, 56, 63, 83**: Uses `context.saveChatDebounced?.()`. The standard SillyTavern extension API exposes `saveSettingsDebounced` for global settings, but chat saving is usually handled internally or exposed as `saveChat()`.
   - **Fix**: Verify against the SillyTavern extension API documentation and replace with the correct chat save method (likely `SillyTavern.getContext().saveChat()`).

## MINOR (Cosmetic, non-blocking, or technical debt)

1. **Missing Quest Manager (`src/core/events.js`)**
   - **Line 43-46**: Quest updates are parsed but only logged with a `// TODO`. While non-blocking, this means `<!--tf-quest:...-->` markers do nothing.

2. **Hardcoded Markers in Prompts (`src/core/prompt-engine.js`)**
   - **Line 54-58**: The system prompt hardcodes example markers (e.g. `<!--tf-imm:book...`) instead of building them from the constants exported in `constants.js` (`MARKER_PREFIX`, etc.). If the prefix changes in settings/constants, the prompt examples will desync.

3. **Inconsistent Context Access (`index.js` vs others)**
   - `index.js` (Line 33) uses `SillyTavern.getContext()`, while other files like `events.js` and `storage.js` safely use `window.SillyTavern?.getContext?.()`. Standardizing on the safer option is recommended.

4. **Missing Message Index in Undo Log (`src/core/parser.js` & `src/stats/delta-processor.js`)**
   - `delta-processor.js` (Line 52) looks for `change.messageIndex || -1`, but `parser.js` does not extract or pass the message index when parsing markers. Undo by message index will always fail.
   - **Fix**: Pass the `msgData` index to `parseMarkers` and attach it to the resulting stat changes.
