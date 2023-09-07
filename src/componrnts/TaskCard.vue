<template>
  <div ref="taskCardRef" class="w-[83%] min-h-[70px] rounded-[22px] task-card-shadow flex flex-row justify-around items-center px-[6%] gap-[10px] overflow-hidden" :style="{ 'background-color': props.taskEntity !== undefined && props.taskEntity.color !== null? props.taskEntity?.color : fun.randomColorFromOpenColor([4,5,6]) }">
    <input ref="inputRef" type="checkbox" title="Complete" checked="checked" class="z-10 d-checkbox h-[24px] min-w-[0] w-[24px] aspect-square border-[3px] border-[hsl(var(--chkbg))] rounded-full outline outline-0 outline-base-100" style="--chkfg: var(--fg); --chkbg: var(--bg)" @change="onCompleteChange" />
    <div class="h-full w-full flex flex-col justify-around items-center py-[8px]">
      <div class="flex flex-row justify-around items-center w-full gap-[8px]">
        <span class="text-[21px] text-center">{{ props.taskEntity !== undefined && props.taskEntity.icon !== null? props.taskEntity.icon : '🍪' }}</span>
        <span class="text-[hsl(var(--fg))] text-[18px] font-[500] truncate w-[80%] text-left">{{ props.taskEntity !== undefined && props.taskEntity.name !== null ? props.taskEntity.name : $t('taskCard.defTaskName') }}</span>
        <div ref="tagsRef" v-if="props.taskEntity?.tags !== undefined && props.taskEntity?.tags.length !== 0" class="flex flex-row justify-end items-center h-[80%]">
          <div v-bind:key="props.taskEntity?.tags[0]?.id" :class="`flex flex-row justify-start items-center px-[8px] h-full max-w-[80px] gap-[6px] rounded-full`" :style="{ 'background-color': props.taskEntity?.tags[0]?.color === undefined? 'hsl(var(--bg))' : props.taskEntity?.tags[0]?.color }">
            <span v-if="props.taskEntity?.tags[0]?.icon !== undefined" class="text-[16px]">{{ props.taskEntity?.tags[0]?.icon }}</span>
            <span class="truncate text-[hsl(var(--fg))] text-[14px] font-[400]">{{ props.taskEntity?.tags[0]?.name }}</span>
          </div>
        </div>
      </div>
      <div class="flex flex-row justify-start items-center gap-[3px] w-full">
        <bell-icon stroke-width="3px" class="h-[14px] text-[hsl(var(--fg))]"/>
        <div class="h-[2px] rounded-full aspect-square bg-[hsl(var(--fg))]"/>
        <div class="flex flex-row justify-start items-center gap-[0]">
          <calendar-check-icon stroke-width="2px" class="h-[14px] text-[hsl(var(--fg))]"/>
          <span class="text-[hsl(var(--fg))] text-[8px] truncate">{{ props.taskEntity !== undefined && props.taskEntity.deadLineDate !== null ? fun.getShortDate(props.taskEntity.deadLineDate) : $t('taskCard.defDeadLine') }}</span>
        </div>
        <div class="h-[2px] rounded-full aspect-square bg-[hsl(var(--fg))]"/>
        <div class="flex flex-row justify-start items-center gap-[0]">
          <badge-alert-icon stroke-width="2px" class="h-[14px] text-[hsl(var(--fg))]"/>
          <div :class="`flex flex-row justify-center items-center ${props.taskEntity?.priority === Priority.MEDIUM || props.taskEntity?.priority === Priority.HIGH? `bg-[hsl(var(--bg))] aspect-square w-[18px] h-[18px] rounded-full` : ''}`">
            <span :class="`text-[hsl(var(--bg))] text-[8px] truncate text-center`" :style="`${props.taskEntity?.priority !== Priority.LOW? `color: var(${priorityColor[props.taskEntity?.priority]}); font-weight: 600;` : ''}`">{{ props.taskEntity !== undefined && props.taskEntity.priority !== null ? $t(`taskCard.priority.${props.taskEntity.priority}`) : $t('taskCard.priority.def') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import {defineProps, onMounted, reactive, ref, Ref} from "vue";
import * as fun from "@/utils/fun";
import {getForegroundColor, getWhiteBlackCssVar} from "@/utils/fun";
import {TaskEntity} from "@/data/database/entities/TaskEntity";
import anime from "animejs/lib/anime.es.js";
import {BadgeAlertIcon, BellIcon, CalendarCheckIcon} from "lucide-vue-next";
import "moment/dist/locale/zh-cn.js";
import {Priority} from "@/data/enum/Priority";

const props = defineProps({
  taskEntity: {
    type: TaskEntity,
    default: undefined,
  }
})

const inputRef: Ref<HTMLInputElement | null> = ref(null);
const taskCardRef: Ref<HTMLDivElement | null> = ref(null);
const tagsRef: Ref<HTMLDivElement | null> = ref(null);

const priorityColor = reactive({
  [Priority.LOW]: undefined,
  [Priority.MEDIUM]: '--oc-yellow-6',
  [Priority.HIGH]: '--oc-red-6',
});

function onCompleteChange() {
  if (inputRef.value?.checked) {
    anime({
      targets: inputRef.value,
      keyframes: [
        {'outline-width': '5vw', 'outline-offset': '0vw'},
        {'outline-width': '100vw', 'outline-offset': '100vw'}
      ],
      delay: 230,
      duration: 500,
      easing: 'easeInCubic',
      complete: () => {
        inputRef.value!.style.removeProperty('outline-width');
        inputRef.value!.style.removeProperty('outline-offset');
      }
    });
    anime({
      targets: taskCardRef.value,
      keyframes: [
        {scale: 0.95},
        {scale: 1},
      ],
      duration: 900,
      easing: 'spring(1, 100, 10, 15)',
      complete: () => {
         taskCardRef.value!.style.removeProperty('scale');
      }
    });
    const dingAudio = new Audio(new URL('../assets/sounds/ding.aac', import.meta.url).href);
    dingAudio.play();
  }
}

function initColorVar() {
  const foregroundColor = getForegroundColor(window.getComputedStyle(taskCardRef.value!).backgroundColor);
  const whiteBlackCss = getWhiteBlackCssVar();

  taskCardRef.value?.style.setProperty('--bg', `var(${foregroundColor === 'white' ? whiteBlackCss.black : whiteBlackCss.white})`);
  taskCardRef.value?.style.setProperty('--fg', `var(${foregroundColor === 'white' ? whiteBlackCss.white : whiteBlackCss.black})`);

  if (tagsRef.value !== null) {
    const tagForegroundColor = getForegroundColor(window.getComputedStyle(tagsRef.value!).backgroundColor);

    tagsRef.value?.style.setProperty('--bg', `var(${tagForegroundColor === 'white' ? whiteBlackCss.black : whiteBlackCss.white})`);
    tagsRef.value?.style.setProperty('--fg', `var(${tagForegroundColor === 'white' ? whiteBlackCss.white : whiteBlackCss.black})`);
  }
}

onMounted(() => {
  initColorVar();
})

</script>
<style scoped lang="less">

</style>
