import { getGlobalSettings, updateGlobalSettings } from '../core/storage.js';
import { createBarColorPickers, applyColors } from './color-picker.js';

export function createSettingsUI() {
    const container = $('#extensions_settings');
    if (!container.length) return;
    
    const wrapper = $('<div class="tf-settings"></div>');
    wrapper.append('<h2>⚒️ Tavern Forge Settings</h2>');
    
    // General
    const general = $('<div class="tf-settings-section"><h3>General</h3></div>');
    general.append(`
        <label>Panel Mode: 
            <select id="tf-setting-panelMode">
                <option value="RIGHT_SIDEBAR">Right Sidebar</option>
                <option value="LEFT_SIDEBAR">Left Sidebar</option>
                <option value="FLOATING">Floating</option>
            </select>
        </label>
        <label><input type="checkbox" id="tf-setting-debugMode"> Enable Debug Mode</label>
    `);
    wrapper.append(general);
    
    // Actions
    wrapper.find('#tf-setting-panelMode').on('change', (e) => {
        const settings = getGlobalSettings();
        settings.panelMode = $(e.target).val();
        updateGlobalSettings(settings);
    });

    wrapper.find('#tf-setting-debugMode').on('change', (e) => {
        const settings = getGlobalSettings();
        settings.debugMode = $(e.target).is(':checked');
        updateGlobalSettings(settings);
    });
    
    container.append(wrapper);
    refreshSettings();
}

export function refreshSettings() {
    const settings = getGlobalSettings();
    $('#tf-setting-panelMode').val(settings.panelMode || 'RIGHT_SIDEBAR');
    $('#tf-setting-debugMode').prop('checked', !!settings.debugMode);
}
