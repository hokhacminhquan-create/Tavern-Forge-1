/**
 * @module slash-commands
 * @description All slash command registrations for Tavern Forge.
 */

import { openWorldMapPopup } from '../ui/world-map-popup.js';

const commands = [
    {
        name: 'tf-var',
        helpString: 'Manage custom variables (add, remove, list)',
        callback: (args, value) => {
            toastr?.success?.('tf-var command executed');
            return '';
        }
    },
    {
        name: 'tf-stat',
        helpString: 'Manually set a stat value',
        callback: (args, value) => {
            toastr?.success?.('tf-stat command executed');
            return '';
        }
    },
    {
        name: 'tf-undo',
        helpString: 'Undo a specific change by ID',
        callback: (args, value) => {
            toastr?.success?.('tf-undo command executed');
            return '';
        }
    },
    {
        name: 'tf-undo-last',
        helpString: 'Undo the most recent change',
        callback: (args, value) => {
            toastr?.success?.('tf-undo-last command executed');
            return '';
        }
    },
    {
        name: 'tf-mode',
        helpString: 'Switch tracking mode (first|third)',
        callback: (args, value) => {
            toastr?.success?.('tf-mode command executed');
            return '';
        }
    },
    {
        name: 'tf-special',
        helpString: 'Manage special characters (add, remove, list)',
        callback: (args, value) => {
            toastr?.success?.('tf-special command executed');
            return '';
        }
    },
    {
        name: 'tf-debug',
        helpString: 'Toggle debug mode (on|off)',
        callback: (args, value) => {
            toastr?.success?.('tf-debug command executed');
            return '';
        }
    },
    {
        name: 'tf-scene',
        helpString: 'Manage scene (location, add-char, remove-char, detect)',
        callback: (args, value) => {
            toastr?.success?.('tf-scene command executed');
            return '';
        }
    },
    {
        name: 'tf-quest',
        helpString: 'Manage quests (add, complete, fail)',
        callback: (args, value) => {
            toastr?.success?.('tf-quest command executed');
            return '';
        }
    },
    {
        name: 'tf-worldmap',
        helpString: 'Manage world map (generate, show, delete)',
        callback: (args, value) => {
            if (value === 'show') {
                openWorldMapPopup(null, null, []); // Use default/dummy for now
                toastr?.success?.('Opening world map...');
            } else {
                toastr?.success?.('tf-worldmap ' + value + ' executed');
            }
            return '';
        }
    },
    {
        name: 'tf-style',
        helpString: 'Manually apply visual style to content',
        callback: (args, value) => {
            toastr?.success?.('tf-style command executed');
            return '';
        }
    },
    {
        name: 'tf-export',
        helpString: 'Export chat RPG state as JSON',
        callback: (args, value) => {
            toastr?.success?.('tf-export command executed');
            return '';
        }
    },
    {
        name: 'tf-import',
        helpString: 'Import RPG state',
        callback: (args, value) => {
            toastr?.success?.('tf-import command executed');
            return '';
        }
    },
    {
        name: 'tf-preset',
        helpString: 'Switch schema preset',
        callback: (args, value) => {
            toastr?.success?.('tf-preset command executed');
            return '';
        }
    },
    {
        name: 'tf-reset',
        helpString: 'Reset all Tavern Forge data for current chat',
        callback: (args, value) => {
            toastr?.success?.('tf-reset command executed');
            return '';
        }
    },
    {
        name: 'tf-init',
        helpString: 'Initialize Tavern Forge from existing chat history',
        callback: (args, value) => {
            toastr?.success?.('tf-init command executed');
            return '';
        }
    }
];

/**
 * Registers all slash commands
 */
export function registerAllCommands() {
    if (!window.SlashCommandParser || !window.SlashCommand) return;
    
    commands.forEach(cmd => {
        window.SlashCommandParser.addCommandObject(window.SlashCommand.fromProps({
            name: cmd.name,
            callback: cmd.callback,
            helpString: cmd.helpString
        }));
    });
}

/**
 * Removes all registered commands
 */
export function unregisterAllCommands() {
    if (!window.SlashCommandParser) return;
    commands.forEach(cmd => {
        if (window.SlashCommandParser.commands && window.SlashCommandParser.commands[cmd.name]) {
            delete window.SlashCommandParser.commands[cmd.name];
        }
    });
}
