// Imports removed - this module operates directly on the chatState object passed to it
/**
 * Returns current scene from chat state.
 */
export function getSceneState(chatState) {
    if (!chatState) return null;
    return chatState.scene || { location: '', characters: [], time: '', weather: '' };
}

/**
 * Merges updates into scene state.
 */
export function updateScene(chatState, updates) {
    if (!chatState) return;
    chatState.scene = chatState.scene || { location: '', characters: [], time: '', weather: '' };
    
    if (updates.location !== undefined) chatState.scene.location = updates.location;
    if (updates.time !== undefined) chatState.scene.time = updates.time;
    if (updates.weather !== undefined) chatState.scene.weather = updates.weather;
    
    if (updates.characters) {
        chatState.scene.characters = [...updates.characters];
    }
    if (updates.characters_add) {
        updates.characters_add.forEach(char => {
            if (!chatState.scene.characters.includes(char)) {
                chatState.scene.characters.push(char);
            }
        });
    }
    if (updates.characters_remove) {
        chatState.scene.characters = chatState.scene.characters.filter(char => !updates.characters_remove.includes(char));
    }
}

/**
 * Updates location and adds to visitedLocations if new.
 */
export function setLocation(chatState, location) {
    if (!chatState) return;
    chatState.scene = chatState.scene || { location: '', characters: [], time: '', weather: '' };
    chatState.scene.location = location;
}

/**
 * Adds character to scene.
 */
export function addCharacterToScene(chatState, characterName) {
    if (!chatState) return;
    chatState.scene = chatState.scene || { location: '', characters: [], time: '', weather: '' };
    if (!chatState.scene.characters.includes(characterName)) {
        chatState.scene.characters.push(characterName);
    }
}

/**
 * Removes character from scene.
 */
export function removeCharacterFromScene(chatState, characterName) {
    if (!chatState || !chatState.scene) return;
    chatState.scene.characters = chatState.scene.characters.filter(c => c !== characterName);
}

/**
 * Returns scene characters array.
 */
export function getCharactersInScene(chatState) {
    if (!chatState || !chatState.scene) return [];
    return chatState.scene.characters || [];
}

/**
 * Resets scene to defaults.
 */
export function clearScene(chatState) {
    if (!chatState) return;
    chatState.scene = { location: '', characters: [], time: '', weather: '' };
}
