<template>
  <div class="fixed bottom-8 right-8 flex flex-col justify-end items-end gap-[20px] z-20">
    <Transition name="options-btn">
      <div v-if="optionsBtnShow" class="w-[140px] flex flex-col gap-[20px] items-end justify-center">
        <button type="button" title="add task list" class="d-btn bg-base-100 w-[140px] h-[52px] border-neutral border rounded-full flex flex-row justify-start items-center gap-[10px] text-stone-500 text-sm font-light shadow-[0_0_10px_0_rgba(0,0,0,0.08)]">
          <list-checks-icon class="w-[24px] h-[24px]" color="hsl(var(--n))" stroke-width="1.6px"></list-checks-icon>
          {{ $t('addTaskBtn.addTaskList') }}
        </button>
        <button type="button" title="add task" class="d-btn bg-base-100 w-[140px] h-[52px] border-neutral border rounded-full flex flex-row justify-start items-center gap-[10px] text-stone-500 text-sm font-light shadow-[0_0_10px_0_rgba(0,0,0,0.08)]">
          <check-circle-icon class="w-[24px] h-[24px]" color="hsl(var(--n))" stroke-width="1.6px"></check-circle-icon>
          {{ $t('addTaskBtn.addTask') }}
        </button>
      </div>
    </Transition>
    <Transition name="add-task-btn">
      <button v-show="addTaskBtnShow" type="button" title="add task" @click="optionsBtnShow=!optionsBtnShow"
              class="add-task-btn d-btn d-btn-circle border-none w-14 h-14 bg-[hsl(var(--bg))] shadow justify-center items-center inline-flex z-30" :style="`--fg: var(${fgColor}); --bg: ${taskGroupColor === undefined? 'var(--p)':taskGroupColor}`">
        <PlusIcon color="hsl(var(--fg))"
                  class="w-[39px] h-[39px] relative flex-col justify-start items-start flex"/>
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import {PlusIcon, ListChecksIcon, CheckCircleIcon} from 'lucide-vue-next'
import {onMounted, onUnmounted, reactive, Ref, ref} from "vue";
import {useAppStores} from "@/stores/app-stores";
import EventType from "@/event/EventType";
import * as dbUtils from "@/data/database/utils/database-utils";
import {RouteLocationNormalized, useRouter} from "vue-router";
import {TaskGroupEntity} from "@/data/database/entities/TaskGroupEntity";
import * as fun from "@/utils/fun";
import Color from "colorjs.io";

const optionsBtnShow = ref(false);
const addTaskBtnShow = ref(true);
const taskGroupColor = ref<string | undefined>();
const fgColor = ref('--b1');

const appStore = useAppStores();
const router = useRouter();

const onScrollInitialized = () => {
  // 获取滚动元素
  const scrollContent = document.getElementById('main-scroll-content');
  if (scrollContent !== null) {

    const scrollEle = scrollContent.parentElement;

    let lastScrollTop = 0;

    if ("addEventListener" in scrollEle) {
      scrollEle.addEventListener('scroll', () => {
        const scrollTop = scrollEle.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop - lastScrollTop > 20) {
          addTaskBtnShow.value = false;
        } else if (scrollTop < lastScrollTop && lastScrollTop - scrollTop > 20) {
          addTaskBtnShow.value = true;
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      });

      // 监听content Click事件
      scrollEle.addEventListener('click', () => {
        optionsBtnShow.value = false;
      });
    } else {
      console.warn('Could not find scroll element');
    }
  } else {
    console.warn('Could not find scroll element');
  }
};

/**
 * 获取任务组颜色以改变按钮背景颜色
 */
async function inTaskGroupPage(route: RouteLocationNormalized) {
  const taskGroupRepository = dbUtils.getTaskGroupEntityRepository();
  if (typeof route.params.taskGroupId !== 'string') return;
  const taskGroupEntity: TaskGroupEntity | null = await taskGroupRepository?.findOne({ where: { id: route.params.taskGroupId }});
  if (taskGroupEntity === null || taskGroupEntity.color === null) return;

  const color = new Color(taskGroupEntity.color);
  taskGroupColor.value = color.to('hsl', {}).toString().replace('hsl(', '').replace(')', '');

  initForegroundColor();
}

/**
 * 初始化前景色
 */
function initForegroundColor() {
  if (taskGroupColor.value === undefined) return;
  fgColor.value = fun.getForegroundColor(typeof taskGroupColor.value === "string" ? `hsl(${taskGroupColor.value})` : '');
}

onMounted(() => {
  if (router.currentRoute.value.name === 'tasks' && router.currentRoute.value.params.taskGroupId) inTaskGroupPage(router.currentRoute.value);

  // 添加监听器
  appStore.eventBus.on(EventType.MAIN_SCROLL_INITIALIZED_EVENT, onScrollInitialized);
});

onUnmounted(() => {
  appStore.eventBus.off(EventType.MAIN_SCROLL_INITIALIZED_EVENT, onScrollInitialized);
});

// 监听路由变化
router.afterEach((to) => {
  fgColor.value = '--b1';
  taskGroupColor.value = undefined;
  if (to.name === 'tasks' && to.params.taskGroupId) inTaskGroupPage(to);
});

</script>

<style scoped lang="less">

</style>
