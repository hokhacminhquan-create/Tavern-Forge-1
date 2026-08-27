import { getChatState } from '../core/storage.js';

export function renderQuestsTab(container$) {
    const state = getChatState();
    const quests = state.questLog || [];
    
    const wrapper = $('<div class="tf-quests-tab"></div>');
    wrapper.append('<h2>Quest Log</h2>');
    
    const activeQuests = quests.filter(q => q.status === 'active' || !q.status);
    const completedQuests = quests.filter(q => q.status === 'completed');
    const failedQuests = quests.filter(q => q.status === 'failed');
    
    if (activeQuests.length > 0) {
        const activeSection = $('<div class="tf-quests__section tf-quests__section--active"><h3>Active</h3></div>');
        activeQuests.forEach(q => activeSection.append(renderQuestItem(q)));
        wrapper.append(activeSection);
    }
    
    if (completedQuests.length > 0) {
        const compSection = $('<div class="tf-quests__section tf-quests__section--completed"><h3>Completed</h3></div>');
        completedQuests.forEach(q => compSection.append(renderQuestItem(q)));
        wrapper.append(compSection);
    }
    
    if (failedQuests.length > 0) {
        const failSection = $('<div class="tf-quests__section tf-quests__section--failed"><h3>Failed</h3></div>');
        failedQuests.forEach(q => failSection.append(renderQuestItem(q)));
        wrapper.append(failSection);
    }
    
    if (quests.length === 0) {
        wrapper.append('<p>No quests recorded yet.</p>');
    }

    wrapper.append('<button class="tf-btn tf-quests__add-btn">Add Quest</button>');
    container$.append(wrapper);
}

export function renderQuestItem(quest) {
    const q$ = $(`<div class="tf-quest-card tf-quest--${quest.status || 'active'}"></div>`);
    q$.append(`<div class="tf-quest-card__title">${quest.title}</div>`);
    if (quest.description) {
        q$.append(`<div class="tf-quest-card__desc">${quest.description}</div>`);
    }
    
    if (quest.objectives && quest.objectives.length > 0) {
        const obj$ = $('<ul class="tf-quest-card__objectives"></ul>');
        quest.objectives.forEach(obj => {
            const check = obj.completed ? '☑' : '☐';
            obj$.append(`<li>${check} ${obj.text || obj}</li>`);
        });
        q$.append(obj$);
    }
    return q$;
}
