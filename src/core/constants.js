/**
 * Shared constants for Tavern Forge extension.
 */

export const MODULE_KEY = 'tavern_forge';
export const MARKER_PREFIX = 'tf';

export const MARKER_TYPES = {
    IMMERSIVE: 'imm',
    SCENE: 'scene',
    RPG: 'rpg',
    QUEST: 'quest'
};

export const VISUAL_TYPES = [
    'book', 'scroll', 'letter', 'system', 'combat', 'shop',
    'dialogue', 'poster', 'check', 'status', 'area',
    'achievement', 'inscription', 'sign', 'recipe'
];

// Marker Regex Patterns
// Immersive: <!--tf-imm:TYPE|key:value-->CONTENT<!--/tf-imm-->
export const IMMERSIVE_REGEX = /<!--tf-imm:([^|]+)\|([^>]+)-->([\s\S]*?)<!--\/tf-imm-->/g;
// Scene: <!--tf-scene:key:value|key:value-->
export const SCENE_REGEX = /<!--tf-scene:([^>]+)-->/g;
// RPG: <!--tf-rpg:TARGET|FIELD+VALUE|FIELD-VALUE-->
export const RPG_REGEX = /<!--tf-rpg:([^|]+)\|([^>]+)-->/g;
// Quest: <!--tf-quest:ACTION|key:value-->
export const QUEST_REGEX = /<!--tf-quest:([^|]+)\|([^>]+)-->/g;

export const PROMPT_POSITION = 0; // Using 0 for before_char/in_chat based on ST
export const PROMPT_ROLE = 0; // SYSTEM role

export const DEFAULT_COLORS = {
    hp: '#e74c3c',
    mp: '#3498db',
    stamina: '#2ecc71',
    xp: '#9b59b6'
};

export const TRACKING_MODE = {
    FIRST_POV: 'first_pov',
    THIRD_POV: 'third_pov'
};

export const PANEL_MODE = {
    RIGHT_SIDEBAR: 'right_sidebar',
    LEFT_SIDEBAR: 'left_sidebar',
    FLOATING: 'floating',
    BUBBLE: 'bubble'
};

export const DEFAULT_GLOBAL_SETTINGS = {
    panelMode: PANEL_MODE.RIGHT_SIDEBAR,
    trackingMode: TRACKING_MODE.FIRST_POV,
    keybindings: {},
    colors: { ...DEFAULT_COLORS },
    debugMode: false
};

export const DEFAULT_CHAT_STATE = {
    schema: null,
    characters: [],
    scene: { location: '', time: '', characters: [] },
    trackingMode: TRACKING_MODE.FIRST_POV,
    undoLog: [],
    questLog: [],
    visitedLocations: []
};
