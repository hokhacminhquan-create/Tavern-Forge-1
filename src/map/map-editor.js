/**
 * @module map-editor
 * @description World map editing capabilities.
 */

/**
 * Enable edit mode on the Cytoscape instance
 * @param {any} cyInstance 
 * @param {Object} worldMap 
 * @param {Function} onSave 
 */
export function enableEditing(cyInstance, worldMap, onSave) {
    // In a full implementation, you would use cy.on() events for interaction
    // Right-click node -> context menu (Edit, Delete)
    // Node drag -> reposition
    cyInstance.on('dragfree', 'node', (evt) => {
        const node = evt.target;
        const pos = node.position();
        const mapNode = worldMap.nodes.find(n => n.id === node.id());
        if (mapNode) {
            mapNode.position = { x: pos.x, y: pos.y };
            onSave(worldMap);
        }
    });
    
    // Add additional event listeners (cxttap, etc.) as needed for full edit features
}

/**
 * Disable edit mode
 * @param {any} cyInstance 
 */
export function disableEditing(cyInstance) {
    cyInstance.off('dragfree', 'node');
    cyInstance.off('cxttap');
}

/**
 * Show a popup/modal form to edit node properties
 * @param {Object} nodeData 
 * @param {Function} onSave 
 */
export function showNodeEditor(nodeData, onSave) {
    // Implementation would use SillyTavern's Popup or a custom modal
    console.log('Tavern Forge: Node Editor shown for', nodeData);
}

/**
 * Show form to edit edge properties
 * @param {Object} edgeData 
 * @param {Function} onSave 
 */
export function showEdgeEditor(edgeData, onSave) {
    // Implementation would use SillyTavern's Popup or a custom modal
    console.log('Tavern Forge: Edge Editor shown for', edgeData);
}
