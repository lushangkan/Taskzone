<template>
  <div class="w-full">
    <div v-bind="$attrs" v-touch:tap="onTapCard"
         v-touch:hold="onHoldCard" v-touch-options="{ touchHoldTolerance: 900 }"
         ref="taskCardRef" class="task-card relative btn-transition leading-none flex-nowrap normal-case w-full min-h-[70px] rounded-[22px] task-card-shadow flex flex-row justify-around items-center px-[6%] gap-[10px] overflow-hidden" :style="{
           'background-color': props.taskEntity !== undefined && props.taskEntity.color !== null? props.taskEntity?.color : fun.randomColorFromOpenColor([4,5,6]),
           '--fg': `var(${fgColor})`,
           '--bg': `var(${bgColor})`,
         }">
      <input ref="inputRef" type="checkbox" title="Complete" class="d-checkbox h-[24px] min-w-[0] w-[24px] aspect-square border-[3px] border-[hsl(var(--chkfg))] rounded-full outline outline-0 outline-base-100" style="--chkfg: var(--fg); --chkbg: var(--bg)" @change="onCompleteChange" />
      <div class="h-full w-[231px] flex flex-col justify-around items-center py-[8px]">
        <div class="flex flex-row justify-between items-center w-full gap-[5px]">
          <div class="flex flex-row justify-start items-center gap-[4px] w-[146px]">
            <span class="text-[21px] text-center">{{ props.taskEntity !== undefined && props.taskEntity.icon !== null? props.taskEntity.icon : '🍪' }}</span>
            <span class="text-[hsl(var(--fg))] text-[18px] font-[500] truncate w-full text-left">{{ props.taskEntity !== undefined && props.taskEntity.name !== null ? props.taskEntity.name : $t('taskCard.defTaskName') }}</span>
          </div>
          <tag-card class="h-[120%]"
              v-if="props.taskEntity?.tags !== undefined && props.taskEntity?.tags[0] !== undefined && props.taskEntity?.tags[0] !== null && props.taskEntity?.tags.length !== 0" :tag-entity="props.taskEntity?.tags[0]!"/>
        </div>
        <div class="flex flex-row justify-start items-center gap-[6px] w-full">
          <bell-icon v-if="hasReminder()" stroke-width="2.5px" class="h-[15px] w-[15px] text-[hsl(var(--fg))]"/>
          <div v-if="hasReminder()" class="h-[3px] rounded-full aspect-square bg-[hsl(var(--fg))]"/>
          <div v-if="hasDDL()" class="flex flex-row justify-start items-center gap-[4px]">
            <calendar-check-icon stroke-width="2.5px" class="h-[15px] w-[15px] text-[hsl(var(--fg))]"/>
            <span class="text-[hsl(var(--fg))] text-[12px] truncate">{{fun.getShortDate(props.taskEntity.deadLineDate)}}</span>
          </div>
          <div v-if="hasPriority()" class="h-[3px] rounded-full aspect-square bg-[hsl(var(--fg))]"/>
          <div v-if="hasPriority()" class="flex flex-row justify-start items-center gap-[4px]">
            <badge-alert-icon stroke-width="2.5px" class="h-[15px] w-[15px] text-[hsl(var(--fg))]"/>
            <div :class="`flex flex-row justify-center items-center ${props.taskEntity?.priority === Priority.LOW || props.taskEntity?.priority === Priority.MEDIUM || props.taskEntity?.priority === Priority.HIGH? `aspect-square w-[18px] h-[18px] rounded-full border-[4px] border-[hsl(var(--fg))]` : ''}`" :style="{ backgroundColor: `var(${priorityColor[props.taskEntity?.priority]})` }"/>
          </div>
        </div>
      </div>
      <div class="drag-handle absolute right-0 top-0 h-full w-[30%]"/>
    </div>
  </div>
</template>
<script setup lang="ts">

import {defineProps, onMounted, reactive, ref, Ref} from "vue";
import * as fun from "@/utils/fun";
import {getForegroundColor} from "@/utils/fun";
import * as DBUtils from "@/data/database/utils/database-utils";
import {TaskEntity} from "@/data/database/entities/TaskEntity";
import anime from "animejs/lib/anime.es.js";
import {BadgeAlertIcon, BellIcon, CalendarCheckIcon} from "lucide-vue-next";
import "moment/dist/locale/zh-cn.js";
import {Priority} from "@/data/enum/Priority";
import {ReminderMode} from "@/data/enum/ReminderMode";
import {useAppStores} from "@/stores/app-stores";
import EventType from "@/event/EventType";
import TagCard from "@/componrnts/TagCard.vue";

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  taskEntity: {
    type: TaskEntity,
    default: undefined,
  },
  isDraggingCard: {
    type: Boolean,
    default: false,
  }
});

const emits = defineEmits<{
  (e: 'on-complete-change', isDone: boolean): void
}>();

const inputRef: Ref<HTMLInputElement | null> = ref(null);
const taskCardRef: Ref<HTMLDivElement | null> = ref(null);

const multiSelectMode = ref(false);

const fgColor = ref('--b1)');
const bgColor = ref('--n');

const priorityColor = reactive({
  [Priority.LOW]: '--oc-gray-4',
  [Priority.NORMAL]: undefined,
  [Priority.MEDIUM]: '--oc-yellow-6',
  [Priority.HIGH]: '--oc-red-6',
});

const appStore = useAppStores();

async function onCompleteChange() {
  // 处于多选模式，则返回
  if (multiSelectMode.value) return;

  if (inputRef.value?.checked) {
    fun.playSound('../assets/sounds/ding.aac');

    // 暂时删除点击动画
    taskCardRef.value?.classList.remove('btn-transition');

    // 播放动画
    anime({
      targets: inputRef.value,
      keyframes: [
        {'outline-width': '5vw', 'outline-offset': '0vw'},
        {'outline-width': '100vw', 'outline-offset': '100vw'}
      ],
      delay: 230,
      duration: 500,
      easing: 'easeInCubic',
      // 完成时运行
      complete: () => {
        if (inputRef.value !== null){
          // 删除动画残留的css属性
          inputRef.value!.style.removeProperty('outline-width');
          inputRef.value!.style.removeProperty('outline-offset');
        }
      }
    });
    anime({
      targets: taskCardRef.value,
      keyframes: [
        {scale: 0.95},
        {scale: 1},
      ],
      duration: 800,
      easing: 'spring(1, 100, 10, 15)',
      // 完成时运行
      complete: async () => {
        if (taskCardRef.value !== null) {
          taskCardRef.value!.style.removeProperty('scale');
        }
        if (props.taskEntity !== undefined) {
          // 更新任务完成状态
          props.taskEntity!.isDone = !props.taskEntity!.isDone;
          // 将新的任务完成状态写入数据库
          await updateTaskDone();
          // 发送完成状态改变事件
          emits.call(null, 'on-complete-change', true)
        }

        // 恢复点击动画
        taskCardRef.value?.classList.add('btn-transition');
      }
    });
  } else {
    if (props.taskEntity !== undefined) {
      // 更新任务完成状态
      props.taskEntity!.isDone = !props.taskEntity!.isDone;
      // 将新的任务完成状态写入数据库
      await updateTaskDone();
      // 发送完成状态改变事件
      emits.call(null, 'on-complete-change', false)
    }
  }
}

/**
 * 初始化前景后景颜色(根据背景颜色)
 */
function initColorVar() {
  const foregroundColor = getForegroundColor(window.getComputedStyle(taskCardRef.value!).backgroundColor);

  bgColor.value = foregroundColor === '--b1'? '--n' : '--b1';
  fgColor.value = foregroundColor === '--b1'? '--b1' : '--n';
}

function hasReminder() {
  return props.taskEntity?.reminders !== ReminderMode.NONE && props.taskEntity?.reminders !== undefined && props.taskEntity?.reminders !== null;
}

function hasDDL() {
  return props.taskEntity?.deadLineDate !== null && props.taskEntity?.deadLineDate !== undefined;
}

function hasPriority() {
  return props.taskEntity?.priority !== null && props.taskEntity?.priority !== Priority.NORMAL
}

async function updateTaskDone() {
  if (props.taskEntity?.id === undefined || null) {
    return;
  }

  await DBUtils.getTaskEntityRepository()?.update((<string>props.taskEntity?.id), {isDone: props.taskEntity.isDone});
}

function onHoldCard(event: any) {
  if (props.isDraggingCard) return;
  if (multiSelectMode.value) return;
  if (!appStore.selectedTasks?.includes(props.taskEntity!)) {
    appStore.selectedTasks?.push(props.taskEntity!);
    appStore.eventBus.emit(EventType.ENABLED_TASK_CARD_MULTI_SELECTION_MODE_EVENT, {});
    if (!(event.target as HTMLElement).isEqualNode(inputRef.value!)) inputRef.value?.click();
  }
}

function onTapCard(event: any) {
  if (!multiSelectMode.value) return;

  if (appStore.selectedTasks?.includes(props.taskEntity!)) {
    appStore.selectedTasks!.splice(appStore.selectedTasks!.indexOf(props.taskEntity!), 1);
    if (!(event.target as HTMLElement).isEqualNode(inputRef.value!)) inputRef.value?.click();
    return;
  }

  appStore.selectedTasks?.push(props.taskEntity!);

  if (!(event.target as HTMLElement).isEqualNode(inputRef.value!)) inputRef.value?.click();
}

const enableMultiSelectCallback = () => {
  multiSelectMode.value = true;

  if (inputRef.value?.className === undefined) return;

  // 如果checkbox已选择，则取消选择
  if (inputRef.value?.checked) inputRef.value?.click();

  // 切换checkbox为多选模式样式
  if (!inputRef.value?.classList.contains('multiple-selection')) inputRef.value?.classList.add('multiple-selection');

  // 删除卡片点击动画
  if (taskCardRef.value?.classList.contains('btn-transition')) taskCardRef.value?.classList.remove('btn-transition');
};

const disableMultiSelectCallback = () => {
  if (inputRef.value?.className === undefined) return;

  // 如果Task为完成状态，则选择checkbox
  if ((!inputRef.value?.checked && props.taskEntity?.isDone) || (inputRef.value?.checked && !props.taskEntity?.isDone)) inputRef.value?.click();

  // 切换checkbox为单选模式样式
  if (inputRef.value?.classList.contains('multiple-selection')) inputRef.value?.classList.remove('multiple-selection');

  // 添加卡片点击动画
  if (!taskCardRef.value?.classList.contains('btn-transition')) taskCardRef.value?.classList.add('btn-transition');

  multiSelectMode.value = false;
};

onMounted(() => {
  // 初始化颜色变量
  initColorVar();

  // 读取任务完成状态
  inputRef.value!.checked = props.taskEntity?.isDone === true;

  // 监听多选模式事件
  appStore.eventBus.on(EventType.ENABLED_TASK_CARD_MULTI_SELECTION_MODE_EVENT, enableMultiSelectCallback);
  appStore.eventBus.on(EventType.DISABLED_TASK_CARD_MULTI_SELECTION_MODE_EVENT, disableMultiSelectCallback)

})

</script>
<style scoped lang="less">

</style>
