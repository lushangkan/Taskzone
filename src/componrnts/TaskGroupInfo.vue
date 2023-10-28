<template>
  <div ref="infoCardRef" class="w-full min-h-[180px] rounded-[22px] flex flex-col justify-start items-center px-[26px] py-[16px] gap-[18px]" :style="{ '--group-color': groupColor === undefined? 'var(--p)' : groupColor, backgroundColor: 'hsla(var(--group-color) / 0.15)' }">
    <div class="w-full flex flex-col justify-start items-center gap-[7px]">
      <div class="w-full flex flex-row justify-between items-center">
        <span class="text-neutral text-[17px] font-medium">{{ props.taskGroupEntity.name }}</span>
        <div class="h-[42px] w-[42px] rounded-[13px] flex justify-center items-center bg-base-100 task-icon-bg-shadow">
          <span class="text-[24px]">{{ props.taskGroupEntity?.icon }}</span>
        </div>
      </div>
      <div v-if="props.taskGroupEntity?.description !== null && props.taskGroupEntity?.description.trim() !== ''" class="w-full flex flex-row justify-start items-center">
        <span class="text-neutral/80 font-light text-[14.5px]">{{ props.taskGroupEntity.description }}</span>
      </div>
    </div>
    <overlay-scrollbars-component v-if="props.taskGroupEntity?.tags.length !== 0" defer element="div" :options="{
          overflow: {
            x: 'scroll',
            y: 'hidden'
          },
          scrollbars: {
            autoHide: 'leave',
            autoHideDelay: 200,
            clickScroll: true,
            theme: 'os-theme-dark',
          }
        }" class="w-full"
    >
      <div :class="`${props.taskGroupEntity?.tags.length === 0 ? 'h-0 gap-y-0' : props.taskGroupEntity?.tags.length === 1? 'h-[30px] gap-y-[4px]' : 'h-[70px] gap-y-[4px]'} inline-flex flex-col flex-wrap justify-start items-start gap-x-[8px]`">
        <tag-card v-for="tag in props.taskGroupEntity?.tags" :key="tag?.id" :tag-entity="tag!"
                  class="!h-[30px] !py-[2px] !w-[100px]"
        />
      </div>
    </overlay-scrollbars-component>
    <div class="w-full flex flex-row justify-between items-end">
      <div class="h-[55px] w-full pb-[3px] flex flex-col flex-wrap justify-between items-start gap-y-[8px] gap-x-[13px] overflow-hidden">
        <div v-if="props.taskGroupEntity !== undefined && props.taskGroupEntity.deadLineDate !== null"
             class="max-w-[100px] flex flex-row justify-start items-center gap-[12px] overflow-hidden">
          <alarm-check-icon class="h-[19px] w-[19px] stroke-neutral/70 stroke-[2px]"/>
          <span class="font-light text-[13.5px] text-clip overflow-hidden whitespace-nowrap">{{ fun.getShortDate(props.taskGroupEntity.deadLineDate) }}</span>
        </div>
        <div v-if="props.taskGroupEntity !== undefined && props.taskGroupEntity.repeatMode !== RepeatMode.ONLY_ONCE"
             class="flex flex-row justify-start items-center gap-[12px] overflow-hidden">
          <repeat-icon class="h-[19px] w-[19px] stroke-neutral/70 stroke-[2px]"/>
          <span class="font-light text-[13.5px] text-clip overflow-hidden whitespace-nowrap">{{ $t(`repeatMode.${props.taskGroupEntity.repeatMode}`) }}</span>
        </div>
        <div v-if="props.taskGroupEntity !== undefined && props.taskGroupEntity.priority !== Priority.NORMAL"
             class="flex flex-row justify-start items-center gap-[12px] overflow-hidden">
          <alert-circle-icon class="h-[19px] w-[19px] stroke-neutral/70 stroke-[2px]"/>
          <!-- TODO:根据背景颜色和文字颜色判断是否要添加背景 -->
          <span :class="`${priorityColor[props.taskGroupEntity.priority] === undefined? 'font-light':'font-bold'} text-[13.5px] text-clip overflow-hidden whitespace-nowrap`" :style="{ color: `var(${priorityColor[props.taskGroupEntity.priority]})` }">{{ $t(`priority.${props.taskGroupEntity.priority}`) }}</span>
        </div>
        <div v-if="props.taskGroupEntity !== undefined && props.taskGroupEntity.repeatMode !== RepeatMode.ONLY_ONCE"
             class="flex flex-row justify-start items-center gap-[12px] overflow-hidden">
          <bell-icon class="h-[19px] w-[19px] stroke-neutral/70 stroke-[2px]"/>
          <!-- TODO:根据背景颜色和文字颜色判断是否要添加背景 -->
          <span class="font-light text-[13.5px] whitespace-nowrap">{{ $t(`reminderMode.${props.taskGroupEntity.reminders}`) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import {OverlayScrollbarsComponent} from "overlayscrollbars-vue";
import {AlarmCheckIcon, AlertCircleIcon, BellIcon, RepeatIcon} from "lucide-vue-next";
import {TaskGroupEntity} from "@/data/database/entities/TaskGroupEntity";
import {onMounted, onUnmounted, reactive, Ref, ref} from "vue";
import Color from "colorjs.io";
import * as fun from "@/utils/fun";
import {RepeatMode} from "@/data/enum/RepeatMode";
import {Priority} from "@/data/enum/Priority";
import TagCard from "@/componrnts/TagCard.vue";
import EventType from "@/event/EventType";
import {useAppStores} from "@/stores/app-stores";

const props = defineProps({
  taskGroupEntity: {
    type: TaskGroupEntity,
    required: true,
  }
});

const groupColor: Ref<string | undefined> = ref(undefined);
const infoCardRef: Ref<HTMLDivElement | null> = ref(null);
let scrollEle: HTMLElement | null | undefined = null;

const appStore = useAppStores();

const priorityColor = reactive({
  [Priority.LOW]: undefined,
  [Priority.NORMAL]: undefined,
  [Priority.MEDIUM]: '--oc-yellow-6',
  [Priority.HIGH]: '--oc-red-6',
});

const onScrollInitialized = () => {
  scrollEle = document.getElementById('main-scroll-content')?.parentElement;

  if (scrollEle !== null && scrollEle !== undefined) {
    scrollEle.addEventListener('scroll', onScroll);
    onScroll();
  }
}

const onScroll = () => {
  requestAnimationFrame(() => {
    const cardBottom = infoCardRef.value?.getBoundingClientRect().bottom;
    const scrollTop = scrollEle?.scrollTop;

    if (cardBottom < scrollTop!) {
      appStore.eventBus.emit(EventType.TASK_GROUP_INFO_HIDDEN_EVENT, {});
    } else {
      appStore.eventBus.emit(EventType.TASK_GROUP_INFO_VISIBLE_EVENT, {});
    }
  });
}

onMounted(() => {
  if (typeof props.taskGroupEntity?.color === 'string') {
    const color = new Color(props.taskGroupEntity.color);
    groupColor.value = color.to('hsl', {}).toString().replace('hsl(', '').replace(')', '');
  }

  // 获取滚动元素
  appStore.eventBus.on(EventType.MAIN_SCROLL_INITIALIZED_EVENT, onScrollInitialized);
});

onUnmounted(() => {
  appStore.eventBus.off(EventType.MAIN_SCROLL_INITIALIZED_EVENT, onScrollInitialized);

  if (scrollEle !== null && scrollEle !== undefined) {
    scrollEle.removeEventListener('scroll', onScroll);
  }
});

</script>
<style scoped lang="less">

</style>
