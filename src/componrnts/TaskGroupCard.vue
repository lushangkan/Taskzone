<template>
 <button type="button" :title="props.taskGroupEntity?.name" ref="cardRef" v-if="taskGroupEntity?.dayTaskDate === null"
         v-touch:tap="onTapCard"
         v-touch:hold="onHoldCard" v-touch-options="{ touchHoldTolerance: 900 }"
         :class="`btn-transition w-full h-[48px] rounded-[16px] flex justify-start items-center px-[12px] gap-[8px] bg-[hsl(var(--bg))] ${selected? 'select-task-group-card':''}`" :style="{ '--bg': bgColor, '--fg': `var(${fgColor})` }">
   <span v-if="taskGroupEntity?.icon !== null" class="text-[22px]">{{ taskGroupEntity.icon }}</span>
   <span class="truncate text-clip font-medium" style="color: hsl(var(--fg));">{{ taskGroupEntity.name }}</span>
 </button>
</template>

<script setup lang="ts">

import {TaskGroupEntity} from "@/data/database/entities/TaskGroupEntity";
import {getForegroundColor} from "@/utils/fun";
import {type Ref, ref, watch} from "vue";
import EventType from "@/event/EventType";
import {useAppStores} from "@/stores/app-stores";
import {storeToRefs} from "pinia";
import {useRouter} from "vue-router";
import Color from "colorjs.io";

const props = defineProps({
  taskGroupEntity: {
    type: TaskGroupEntity,
    default: undefined,
  }
});

const emit = defineEmits<{
  (e: 'beforeJumpToGroup'): void
}>()

const appStore = useAppStores();
const router = useRouter();

const cardRef: Ref<HTMLDivElement | null> = ref(null);

const fgColor = ref<string>('--b1');
const bgColor = ref<string>('--p');
const multiSelectMode = ref(false);
const draggingCard = ref<boolean>(false);
const selected = ref(false);

const { selectedTaskGroups } = storeToRefs(appStore);


watch(selectedTaskGroups, (value) =>{
  if (value.includes(props.taskGroupEntity!)) {
    selected.value = true;
  } else if (!value.includes(props.taskGroupEntity!)) {
    selected.value = false;
  }
}, { deep: true, immediate: true });

function initColorVar() {
  if (typeof props.taskGroupEntity?.color === 'string') {
    const color = new Color(props.taskGroupEntity.color);
    bgColor.value = color.to('hsl', {}).toString().replace('hsl(', '').replace(')', '');
    fgColor.value = getForegroundColor(color.to('srgb', {}).toString());
  }
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

  // 处于多选模式
  if (multiSelectMode.value) {
    if (appStore.selectedTaskGroups.includes(props.taskGroupEntity!)) {
      appStore.selectedTaskGroups.splice(appStore.selectedTaskGroups.indexOf(props.taskGroupEntity!), 1);
    } else {
      appStore.selectedTaskGroups.push(props.taskGroupEntity!);
    }
    return;
  }

  emit('beforeJumpToGroup');

  //导航到任务
  router.push('/tasks/' + props.taskGroupEntity!.id);
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
