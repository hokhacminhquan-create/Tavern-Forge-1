/**
 * Tracks visited locations.
 */

export function addVisitedLocation(chatState, locationName) {
    if (!chatState || !locationName) return;
    chatState.visitedLocations = chatState.visitedLocations || [];
    
    const existing = chatState.visitedLocations.find(l => l.name === locationName);
    if (existing) {
        existing.visitCount = (existing.visitCount || 1) + 1;
    } else {
        chatState.visitedLocations.push({
            name: locationName,
            firstVisited: new Date().toISOString(),
            visitCount: 1
        });
    }
}

export function getVisitedLocations(chatState) {
    if (!chatState || !chatState.visitedLocations) return [];
    return chatState.visitedLocations;
}

export function isLocationVisited(chatState, locationName) {
    if (!chatState || !chatState.visitedLocations) return false;
    return chatState.visitedLocations.some(l => l.name === locationName);
}

export function getLocationVisitCount(chatState, locationName) {
    if (!chatState || !chatState.visitedLocations) return 0;
    const loc = chatState.visitedLocations.find(l => l.name === locationName);
    return loc ? (loc.visitCount || 0) : 0;
}
