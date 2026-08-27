/**
 * @module map-renderer
 * @description Cytoscape.js integration for rendering the world map.
 */

let cytoscape = null;

/**
 * Dynamically import/load Cytoscape.js library
 * @returns {Promise<any>}
 */
export async function loadCytoscape() {
    if (cytoscape) return cytoscape;
    try {
        const module = await import('../../../lib/cytoscape.min.js');
        cytoscape = module.default || module;
        return cytoscape;
    } catch (e) {
        console.error('Tavern Forge: Failed to load cytoscape.js', e);
        throw e;
    }
}

/**
 * Convert WorldMap nodes/edges to Cytoscape format
 * @param {Object} worldMap 
 * @returns {Array}
 */
export function convertToCytoscapeElements(worldMap) {
    const elements = [];
    if (worldMap.nodes) {
        worldMap.nodes.forEach(n => {
            const el = {
                data: { id: n.id, name: n.name, type: n.type, description: n.description, icon: n.icon }
            };
            if (n.position) {
                el.position = { x: n.position.x, y: n.position.y };
            }
            elements.push(el);
        });
    }
    if (worldMap.edges) {
        worldMap.edges.forEach(e => {
            elements.push({
                data: { id: e.id, source: e.from, target: e.to, label: e.label, type: e.type }
            });
        });
    }
    return elements;
}

/**
 * Return the Cytoscape stylesheet array for RPG theming
 * @returns {Array}
 */
export function getCytoscapeStyle() {
    return [
        {
            selector: 'node',
            style: {
                'label': 'data(name)',
                'text-valign': 'bottom',
                'text-halign': 'center',
                'text-margin-y': 5,
                'color': '#fff',
                'text-outline-width': 2,
                'text-outline-color': '#000',
                'background-color': '#888',
                'width': 30,
                'height': 30,
                'font-size': '12px'
            }
        },
        {
            selector: 'node[type="settlement"]',
            style: { 'background-color': '#ffd700' } // gold
        },
        {
            selector: 'node[type="wilderness"]',
            style: { 'background-color': '#228b22' } // green
        },
        {
            selector: 'node[type="dungeon"]',
            style: { 'background-color': '#dc143c' } // red
        },
        {
            selector: 'node[type="landmark"]',
            style: { 'background-color': '#4169e1' } // blue
        },
        {
            selector: '.current-location',
            style: {
                'border-width': 4,
                'border-color': '#00ffff',
                'border-opacity': 0.8
            }
        },
        {
            selector: '.unvisited',
            style: {
                'opacity': 0.5
            }
        },
        {
            selector: 'edge',
            style: {
                'width': 3,
                'line-color': '#aaa',
                'curve-style': 'bezier',
                'label': 'data(label)',
                'font-size': '10px',
                'color': '#ddd',
                'text-outline-width': 1,
                'text-outline-color': '#000',
                'text-margin-y': -10
            }
        },
        {
            selector: 'edge[type="path"]',
            style: { 'line-style': 'dashed' }
        },
        {
            selector: 'edge[type="river"]',
            style: { 'line-color': '#4169e1', 'curve-style': 'unbundled-bezier' }
        }
    ];
}

/**
 * Create a Cytoscape graph instance
 * @param {HTMLElement} container 
 * @param {Object} worldMap 
 * @param {string} currentLocation 
 * @param {Array<string>} visitedLocations 
 * @returns {Promise<any>}
 */
export async function createMapInstance(container, worldMap, currentLocation, visitedLocations) {
    const cyLib = await loadCytoscape();
    const elements = convertToCytoscapeElements(worldMap);
    
    const cy = cyLib({
        container: container,
        elements: elements,
        style: getCytoscapeStyle(),
        layout: {
            name: 'cose',
            animate: false
        },
        wheelSensitivity: 0.2
    });

    if (visitedLocations && visitedLocations.length > 0) {
        updateVisitedLocations(cy, visitedLocations);
    } else {
        // Assume none visited except current if empty
        cy.nodes().addClass('unvisited');
    }

    if (currentLocation) {
        updateCurrentLocation(cy, currentLocation);
    }

    return cy;
}

/**
 * Highlight the current location node
 * @param {any} cyInstance 
 * @param {string} nodeId 
 */
export function updateCurrentLocation(cyInstance, nodeId) {
    cyInstance.nodes().removeClass('current-location');
    const node = cyInstance.getElementById(nodeId);
    if (node) {
        node.addClass('current-location');
        node.removeClass('unvisited');
    }
}

/**
 * Update visited/unvisited styling
 * @param {any} cyInstance 
 * @param {Array<string>} visitedIds 
 */
export function updateVisitedLocations(cyInstance, visitedIds) {
    cyInstance.nodes().forEach(node => {
        if (visitedIds.includes(node.id())) {
            node.removeClass('unvisited');
        } else {
            node.addClass('unvisited');
        }
    });
}

/**
 * Cleanup Cytoscape instance
 * @param {any} cyInstance 
 */
export function destroyMapInstance(cyInstance) {
    if (cyInstance) {
        cyInstance.destroy();
    }
}
