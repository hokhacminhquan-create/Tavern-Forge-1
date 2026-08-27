/**
 * @module world-map-popup
 * @description Full-screen world map popup overlay.
 */

import { createMapInstance, destroyMapInstance } from '../map/map-renderer.js';

let currentCyInstance = null;

/**
 * Create and show full-screen overlay
 * @param {Object} worldMap 
 * @param {string} currentLocation 
 * @param {Array<string>} visitedLocations 
 */
export async function openWorldMapPopup(worldMap, currentLocation, visitedLocations) {
    if (document.getElementById('tf-worldmap-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'tf-worldmap-overlay';
    overlay.className = 'tf-worldmap-overlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.8); z-index: 10000;
        display: flex; justify-content: center; align-items: center;
    `;

    overlay.innerHTML = `
        <div class="tf-worldmap-container" style="width: 90%; height: 90%; background: #222; border-radius: 8px; display: flex; flex-direction: column;">
            <div class="tf-worldmap-header" style="padding: 10px; background: #333; display: flex; justify-content: space-between; align-items: center;">
                <span class="tf-worldmap-title" style="color: white; font-size: 1.2em;">🗺️ World Map: ${worldMap ? worldMap.name : 'Unknown'}</span>
                <div class="tf-worldmap-controls">
                    <button class="tf-worldmap-btn" data-action="edit">✏️ Edit</button>
                    <button class="tf-worldmap-btn" data-action="regenerate">🔄 Regenerate</button>
                    <button class="tf-worldmap-close">✕</button>
                </div>
            </div>
            <div id="tf-worldmap-canvas" style="flex-grow: 1; position: relative;"></div>
        </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('.tf-worldmap-close').addEventListener('click', closeWorldMapPopup);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeWorldMapPopup();
    });

    const canvas = document.getElementById('tf-worldmap-canvas');
    if (worldMap) {
        currentCyInstance = await createMapInstance(canvas, worldMap, currentLocation, visitedLocations);
    }
}

/**
 * Destroy Cytoscape instance and remove overlay
 */
export function closeWorldMapPopup() {
    if (currentCyInstance) {
        destroyMapInstance(currentCyInstance);
        currentCyInstance = null;
    }
    const overlay = document.getElementById('tf-worldmap-overlay');
    if (overlay) {
        overlay.remove();
    }
}

/**
 * Re-render with updated data
 * @param {Object} worldMap 
 * @param {string} currentLocation 
 * @param {Array<string>} visitedLocations 
 */
export async function refreshWorldMap(worldMap, currentLocation, visitedLocations) {
    closeWorldMapPopup();
    await openWorldMapPopup(worldMap, currentLocation, visitedLocations);
}
