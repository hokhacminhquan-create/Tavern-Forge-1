/**
 * Quest CRUD and objective tracking.
 */

export function addQuest(chatState, questData) {
    if (!chatState) return;
    chatState.questLog = chatState.questLog || [];
    
    const newQuest = {
        id: questData.id || `quest_${Date.now()}`,
        title: questData.title || 'Unknown Quest',
        description: questData.description || '',
        status: 'active',
        objectives: questData.objectives || [],
        rewards: questData.rewards || '',
        createdAt: new Date().toISOString(),
        completedAt: null
    };
    
    chatState.questLog.push(newQuest);
    return newQuest;
}

export function updateQuest(chatState, questId, updates) {
    const quest = getQuest(chatState, questId);
    if (quest) {
        Object.assign(quest, updates);
    }
}

export function completeQuest(chatState, questId) {
    const quest = getQuest(chatState, questId);
    if (quest) {
        quest.status = 'completed';
        quest.completedAt = new Date().toISOString();
    }
}

export function failQuest(chatState, questId) {
    const quest = getQuest(chatState, questId);
    if (quest) {
        quest.status = 'failed';
    }
}

export function getQuest(chatState, questId) {
    if (!chatState || !chatState.questLog) return null;
    return chatState.questLog.find(q => q.id === questId);
}

export function getActiveQuests(chatState) {
    if (!chatState || !chatState.questLog) return [];
    return chatState.questLog.filter(q => q.status === 'active');
}

export function getCompletedQuests(chatState) {
    if (!chatState || !chatState.questLog) return [];
    return chatState.questLog.filter(q => q.status === 'completed');
}

export function getFailedQuests(chatState) {
    if (!chatState || !chatState.questLog) return [];
    return chatState.questLog.filter(q => q.status === 'failed');
}

export function getAllQuests(chatState) {
    if (!chatState || !chatState.questLog) return [];
    return chatState.questLog;
}

export function completeObjective(chatState, questId, objectiveIndex) {
    const quest = getQuest(chatState, questId);
    if (quest && quest.objectives && quest.objectives[objectiveIndex]) {
        quest.objectives[objectiveIndex].completed = true;
    }
}

export function processQuestUpdates(questUpdates, chatState) {
    if (!questUpdates || !Array.isArray(questUpdates)) return;
    
    questUpdates.forEach(update => {
        if (update.action === 'add') {
            addQuest(chatState, update);
        } else if (update.action === 'complete') {
            completeQuest(chatState, update.id);
        } else if (update.action === 'fail') {
            failQuest(chatState, update.id);
        } else if (update.action === 'update') {
            updateQuest(chatState, update.id, {
                objectives: update.objectives,
                description: update.description
            });
        }
    });
}
