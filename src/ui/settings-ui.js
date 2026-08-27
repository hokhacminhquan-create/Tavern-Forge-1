import { getGlobalSettings, updateGlobalSettings } from '../core/storage.js';
import { createBarColorPickers, applyColors } from './color-picker.js';

export function createSettingsUI() {
    const container = $('#extensions_settings');
    if (!container.length || $('#tf-settings-wrapper').length) return;
    
    const wrapper = $(`
        <div id="tf-settings-wrapper" class="inline-drawer">
            <div class="inline-drawer-toggle inline-drawer-header">
                <b>⚒️ Tavern Forge</b>
                <div class="inline-drawer-icon fa-solid fa-chevron-down down"></div>
            </div>
            <div class="inline-drawer-content" style="display: none;">
                <div class="tf-settings">
                    <div class="tf-settings-section">
                        <label>Panel Mode: 
                            <select id="tf-setting-panelMode" class="text_pole">
                                <option value="RIGHT_SIDEBAR">Right Sidebar</option>
                                <option value="LEFT_SIDEBAR">Left Sidebar</option>
                                <option value="FLOATING">Floating</option>
                            </select>
                        </label>
                        <br><br>
                        <label><input type="checkbox" id="tf-setting-debugMode"> Enable Debug Mode</label>
                    </div>
                </div>
            </div>
        </div>
    `);

    // Standard ST toggle logic
    wrapper.find('.inline-drawer-toggle').on('click', function () {
        $(this).closest('.inline-drawer').find('.inline-drawer-content').slideToggle('fast');
        $(this).find('.inline-drawer-icon').toggleClass('down up fa-chevron-down fa-chevron-up');
    });

    // Actions
    wrapper.find('#tf-setting-panelMode').on('change', (e) => {
        updateGlobalSettings('panelMode', $(e.target).val());
    });

    wrapper.find('#tf-setting-debugMode').on('change', (e) => {
        updateGlobalSettings('debugMode', $(e.target).is(':checked'));
    });
    
    container.append(wrapper);
    refreshSettings();
}

export function refreshSettings() {
    const settings = getGlobalSettings();
    $('#tf-setting-panelMode').val(settings.panelMode || 'RIGHT_SIDEBAR');
    $('#tf-setting-debugMode').prop('checked', !!settings.debugMode);
}
