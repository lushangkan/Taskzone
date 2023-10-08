import {defineStore} from "pinia";
import {Ref, ref, watch} from "vue";
import mitt from 'mitt';
import {TaskEntity} from "@/data/database/entities/TaskEntity";
import EventType from "@/event/EventType";

export const useAppStores = defineStore('appStore', () => {
    const isSupportEmoji = ref();
    const eventBus = mitt();
    const selectedTasks: Ref<TaskEntity[]> = ref([]);

    eventBus.on(EventType.DISABLED_TASK_CARD_MULTI_SELECTION_MODE_EVENT, () => {
        // 清理选中的任务
        selectedTasks.value = [];
    });

    return {isSupportEmoji, eventBus, selectedTasks};
});
