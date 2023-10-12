import {defineStore} from "pinia";
import {Ref, ref, watch} from "vue";
import mitt from 'mitt';
import {TaskEntity} from "@/data/database/entities/TaskEntity";
import EventType from "@/event/EventType";
import {TaskGroupEntity} from "@/data/database/entities/TaskGroupEntity";

export const useAppStores = defineStore('appStore', () => {
    const isSupportEmoji = ref();
    const eventBus = mitt();

    const selectedTasks: Ref<TaskEntity[]> = ref([]);
    const selectedTaskGroups: Ref<TaskGroupEntity[]> = ref([]);

    eventBus.on(EventType.DISABLED_TASK_CARD_MULTI_SELECTION_MODE_EVENT, () => {
        // 清理选中的任务
        selectedTasks.value = [];
    });

    eventBus.on(EventType.DISABLED_TASK_GROUP_CARD_MULTI_SELECTION_MODE_EVENT, () => {
        // 清理选中的任务组
        selectedTaskGroups.value = [];
    });

    return {isSupportEmoji, eventBus, selectedTasks, selectedTaskGroups};
});
