# Phase 3-7 Review Report: Tavern Forge

This report outlines the inconsistencies and issues found when reviewing the UI, scene, visuals, map, and slash-command modules, specifically focusing on how they integrate with the core/stats modules and the SillyTavern API.

## CRITICAL ISSUES (Breaking / Missing Integration)

1. **Non-existent Imports in Map and Scene Managers**
   - **Files:** `src/map/world-map.js`, `src/scene/scene-manager.js`
   - **Issue:** Both files use `import { getStorage, setStorage, saveStorage } from '../core/storage.js';`
   - **Fix:** These functions do not exist in `storage.js`. You must import `getChatState`, `getGlobalSettings`, `updateChatState`, and `updateGlobalSettings` instead, and adapt the logic to use them.

2. **Broken Import in World Map**
   - **File:** `src/map/world-map.js`
   - **Issue:** Imports `generateQuietPrompt` from `../utils/helpers.js` (line 7), but it is not exported there. The file correctly falls back to `window.SillyTavern.getContext().generateQuietPrompt` later in the code.
   - **Fix:** Remove the broken import.

3. **Missing Core Extension Hook-ups (index.js / events.js)**
   - **Files:** `index.js`, `src/core/events.js`
   - **Issue:** The newly created modules are never initialized. `index.js` does not call `createPanel()` (UI), `registerAllTemplates()` (Visuals), or `registerAllCommands()` (Slash commands).
   - **Fix:** Update `index.js` to call these initialization routines during `onActivate()` or `onAppReady()`. Furthermore, in `src/core/events.js`, the `CHARACTER_MESSAGE_RENDERED` event is stubbed out and never calls `renderMessageVisuals(messageId)` from `visual-renderer.js`.

4. **Massive Data Structure Inconsistencies**
   - **File:** `src/ui/stats-tab.js` 
     - **Issue:** Expects character data to live on the root character object (e.g., `character.class`, `character.race`, `character.bars`, `character.attributes`). However, `src/stats/characters.js` stores these inside `character.values` (e.g., `character.values['Class']`) and `character.maxValues`. There is no `.bars` or `.attributes` property.
   - **File:** `src/ui/log-tab.js`
     - **Issue:** Tries to read `state.logs`, but `DEFAULT_CHAT_STATE` in `constants.js` calls it `state.undoLog`.
   - **File:** `src/ui/quests-tab.js`
     - **Issue:** Tries to read `state.quests`, but `DEFAULT_CHAT_STATE` calls it `state.questLog`.
   - **File:** `src/ui/scene-tab.js`
     - **Issue:** Iterates over `state.characters` to show characters present in the scene, which will incorrectly list *all* known characters. It should read `state.scene.characters` and look them up.
   - **File:** `src/ui/color-picker.js`
     - **Issue:** Tries to iterate over `schema.bars`, but `schema` is an object containing `schema.variables` (an array). You must use `getBarVariables(schema)` from `schema.js`.

## MAJOR ISSUES

1. **Broken Constants Import in UI Panel**
   - **File:** `src/ui/panel.js`
   - **Issue:** Uses `import { RIGHT_SIDEBAR, LEFT_SIDEBAR, FLOATING, BUBBLE } from '../core/constants.js';` but `constants.js` exports an object `PANEL_MODE` containing these keys. This causes variables like `mode` to be undefined, crashing `mode.toLowerCase()`.
   - **Fix:** Use `import { PANEL_MODE } from '../core/constants.js';` and access them via `PANEL_MODE.RIGHT_SIDEBAR`.

2. **Placeholder Slash Commands**
   - **File:** `src/utils/slash-commands.js`
   - **Issue:** The commands are just placeholders that call `toastr?.success(...)` and return `''`. They do not actually reference or execute the exported functions from the other modules (e.g., `tf-worldmap` doesn't call `generateWorldMap`, `tf-scene` doesn't call `setLocation`).
   - **Fix:** Wire up the callback logic for each command to actually import and call the respective API functions.

3. **Duplicated Scene Logic**
   - **File:** `src/core/events.js`
   - **Issue:** In `onMessageReceived`, the file manually mutates `newScene` by duplicating the logic of adding/removing characters. 
   - **Fix:** It should import and use `updateScene(chatState, updates)` from `src/scene/scene-manager.js`.

4. **Fragile Visual String Replacement**
   - **File:** `src/visuals/visual-renderer.js`
   - **Issue:** Uses `htmlContent.replace(safeContent, renderedHtml)`. The `safeContent` from the AI generator is often plain text, while `htmlContent` is SillyTavern's rendered HTML (containing `<p>` tags). `replace` will fail to match if formatting or line-breaks differ.
   - **Fix:** Use more robust DOM traversal or find exact AI marker substrings to perform the replacement.

## MINOR ISSUES

1. **Fragile Global Imports**
   - **File:** `src/utils/slash-commands.js`
   - **Issue:** Imports `SlashCommandParser` using a deeply nested relative path `../../../../slash-commands/SlashCommandParser.js`. 
   - **Fix:** Since SillyTavern extensions can access `window.SlashCommandParser` globally, using the global reference is safer and less prone to directory structure changes.
