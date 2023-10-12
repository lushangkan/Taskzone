<template>
 <div ref="cardRef" v-if="taskGroupEntity?.dayTaskDate === null"
      v-touch:tap="onTapCard"
      v-touch:hold="onHoldCard" v-touch-options="{ touchHoldTolerance: 300 }"
      class="btn-transition w-full h-[48px] rounded-[16px] flex justify-start items-center px-[12px] gap-[8px]" :style="{ backgroundColor: taskGroupEntity?.color, '--fg': `var(${fgColor})` }">
   <span v-if="taskGroupEntity?.icon !== null" class="text-[22px]">{{ taskGroupEntity.icon }}</span>
   <span class="truncate text-clip font-medium" style="color: hsl(var(--fg));">{{ taskGroupEntity.name }}</span>
 </div>
</template>

<script setup lang="ts">

import {TaskGroupEntity} from "@/data/database/entities/TaskGroupEntity";
import {getForegroundColor, getWhiteBlackCssVar} from "@/utils/fun";
import {onMounted, type Ref, ref, watch} from "vue";
import EventType from "@/event/EventType";
import {useAppStores} from "@/stores/app-stores";
import {storeToRefs} from "pinia";

const props = defineProps({
  taskGroupEntity: {
    type: TaskGroupEntity,
    default: undefined,
  }
});

const appStore = useAppStores();

const cardRef: Ref<HTMLDivElement | null> = ref(null);

const fgColor = ref<string>('--b1');
const multiSelectMode = ref(false);
const draggingCard = ref<boolean>(false);

const { selectedTaskGroups } = storeToRefs(appStore);

watch(selectedTaskGroups, (value) =>{
  if (value.includes(props.taskGroupEntity!) && !cardRef.value?.classList.contains('select-task-group-card')) {
    cardRef.value?.classList.add('select-task-group-card');
  } else if (!value.includes(props.taskGroupEntity!) && cardRef.value?.classList.contains('select-task-group-card')) {
    cardRef.value?.classList.remove('select-task-group-card');
  }
}, { deep: true });

function initColorVar() {
  fgColor.value = getForegroundColor(window.getComputedStyle(cardRef.value!).backgroundColor);
}

function onHoldCard() {
  if (draggingCard.value) return;
  if (multiSelectMode.value) return;
  if (appStore.selectedTaskGroups.includes(props.taskGroupEntity!)) return;

  appStore.selectedTaskGroups.push(props.taskGroupEntity!);
  appStore.eventBus.emit(EventType.ENABLED_TASK_GROUP_CARD_MULTI_SELECTION_MODE_EVENT, {});
}

function onTapCard() {
  if (draggingCard.value) return;
  if (!multiSelectMode.value) return;

  if (appStore.selectedTaskGroups.includes(props.taskGroupEntity!)) {
    appStore.selectedTaskGroups.splice(appStore.selectedTaskGroups.indexOf(props.taskGroupEntity!), 1);
  } else {
    appStore.selectedTaskGroups.push(props.taskGroupEntity!);
  }
}

const draggingCallback = () => {
  draggingCard.value = true;
};

const dragEndCallback = () => {
  draggingCard.value = false;
};

const enableMultiSelectModeCallBack = () => {
  // 移除按动动画
  cardRef.value?.classList.remove('btn-transition');

  multiSelectMode.value = true;
};

const disableMultiSelectModeCallBack = () => {
  // 添加按动动画
  cardRef.value?.classList.add('btn-transition');

  multiSelectMode.value = false;
};

watch(cardRef, (value) => {
  if (value !== null) initColorVar();

  // 监听拖拽事件
  appStore.eventBus.on(EventType.DRAGGING_TASK_GROUP_CARD_EVENT, draggingCallback);
  appStore.eventBus.on(EventType.DRAG_TASK_GROUP_CARD_END_EVENT, dragEndCallback);

  // 监听多选事件
  appStore.eventBus.on(EventType.ENABLED_TASK_GROUP_CARD_MULTI_SELECTION_MODE_EVENT, enableMultiSelectModeCallBack);
  appStore.eventBus.on(EventType.DISABLED_TASK_GROUP_CARD_MULTI_SELECTION_MODE_EVENT, disableMultiSelectModeCallBack);
});

</script>

<style scoped lang="less">

</style>
