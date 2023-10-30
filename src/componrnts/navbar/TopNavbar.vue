<template>
  <sticky-element :scrollElement="scrollEle" stuckClass="navbar-stuck" showClass="navbar-show" transitionClass="navbar-transition" id="sticky-navbar">
    <div id="app-navbar" class="fixed flex flex-col justify-start items-center w-full py-[16px] z-10">
      <ion-header
          class="relative border-none w-[348px] h-[63px] px-[13px] rounded-3xl navbar-shadow bg-gradient-to-br from-[hsl(var(--p--100))] to-[hsl(var(--p-300))]" :style="`${taskGroupEntity?.color !== undefined? `background: ${taskGroupEntity?.color}`:''}; --fg: var(${fgColor}); `">
        <div v-if="!multiSelectMode" class="w-full h-full flex flex-row justify-between items-center px-0">
          <div class="navbar-start w-[56px] h-[48px]">
            <button type="button" title="Open menu" :class="`w-[56px] h-[48px] d-btn d-btn-ghost ${menuOpen?'d-btn-active':''}`"
                    @click="menuOpen=!menuOpen">
              <menu-icon class="w-[24px] h-[24px]" color="hsl(var(--fg))"/>
            </button>
          </div>
          <div class="navbar-center w-[210px]">
            <Transition name="navbar-title">
              <div v-show="showTitle" class="flex flex-row justify-center items-center gap-[3px] w-full">
                <span v-if="taskGroupEntity?.icon !== undefined" class="text-[25px]">{{ taskGroupEntity?.icon }}</span>
                <span class="truncate	whitespace-nowrap text-lg font-medium" style="color: hsl(var(--fg))">{{
                    pageName === 'tasks' ? tasksTitle === 'today' ? i18n.t('page.tasks.today') : taskGroupEntity !== undefined? taskGroupEntity.name : tasksTitle : i18n.t(`page.${pageName}.name`, i18n.t('page.pageNotFound'))
                  }}
                </span>
              </div>
            </Transition>
          </div>
          <div class="navbar-end w-[56px] h-[48px]">
            <button v-if="pageName==='tasks' && date !== undefined" type="button" title="Open datepicker"
                    :class="`w-[56px] h-[48px] d-btn d-btn-ghost ${datepickerOpen?'d-btn-active':''}`"
                    @click="datepickerOpen=!datepickerOpen">
              <calendar-days-icon class="w-[24px] h-[24px]" color="hsl(var(--fg))"/>
            </button>
            <div>
              <button v-if="pageName==='tasks' && isTaskGroupPage && taskGroupEntity !== undefined" type="button" title="Open datepicker"
                      :class="`w-[56px] h-[48px] d-btn d-btn-ghost ${taskGroupMenuOpen?'d-btn-active':''}`"
                      @click="taskGroupMenuOpen=!taskGroupMenuOpen">
                <more-horizontal class="w-[24px] h-[24px]" color="hsl(var(--fg))"/>
              </button>
              <Transition name="navbar-menu">
                <task-group-menu v-if="taskGroupMenuOpen && taskGroupEntity !== undefined" :task-group-entity="taskGroupEntity" @click-del-btn="taskGroupMenuOpen=false" @click-out-side="taskGroupMenuOpen=false"/>
              </Transition>
            </div>
          </div>
        </div>
        <div v-if="multiSelectMode" class="w-full h-full flex flex-row justify-end items-center px-0">
          <div class="navbar-end relative">
            <button type="button" title="Close multi select mode"
                    class="d-btn d-btn-ghost" @click="onClickCloseBtn">
              <x class="w-[24px] h-[24px]" color="hsl(var(--fg))"/>
            </button>
            <button type="button" title="Delete task"
                    class="d-btn d-btn-ghost" @click="onClickDeleteBtn">
              <trash2 class="w-[24px] h-[24px]" color="hsl(var(--fg))"/>
            </button>
            <button ref="multiSelectMenuBtn" type="button" title="More" :class="`d-btn d-btn-ghost ${multiSelectMenuOpen?'d-btn-active':''}`" @click="multiSelectMenuOpen=!multiSelectMenuOpen">
              <more-horizontal class="w-[24px] h-[24px]" color="hsl(var(--fg))"/>
            </button>
            <Transition name="navbar-menu">
              <multi-select-menu v-if="multiSelectMenuOpen"/>
            </Transition>
          </div>
        </div>
      </ion-header>
      <Transition name="datepicker">
        <navbar-datepicker v-if="datepickerOpen" v-model="date"/>
      </Transition>
    </div>
  </sticky-element>
  <side-panel @on-close-side-panel="menuOpen=false" class="w-full h-full z-20"/>
  <slot/>
</template>

<script setup lang="ts">
import {IonHeader, menuController} from "@ionic/vue";
import {CalendarDaysIcon, MenuIcon, MoreHorizontal, Trash2, X} from 'lucide-vue-next';
import {onMounted, onUnmounted, ref, watch, WatchStopHandle} from "vue";
import {RouteLocationNormalized, useRouter} from "vue-router";
import SidePanel from "@/componrnts/navbar/SidePanel.vue";
import NavbarDatepicker from "@/componrnts/navbar/NavbarDatepicker.vue";
import StickyElement from 'vue-sticky-element';
import {useAppStores} from "@/stores/app-stores";
import {useI18n} from "vue-i18n";
import moment, {Moment} from "moment";
import "moment/dist/locale/zh-cn.js";
import EventType from "@/event/EventType";
import * as fun from "@/utils/fun";
import {TaskGroupEntity} from "@/data/database/entities/TaskGroupEntity";
import * as dbUtils from "@/data/database/utils/database-utils";
import MultiSelectMenu from "@/componrnts/navbar/MultiSelectMenu.vue";
import TaskGroupMenu from "@/componrnts/navbar/TaskGroupMenu.vue";

const i18n = useI18n();
const router = useRouter();
const appStore = useAppStores();

const pageName = ref(router.currentRoute.value.name);
const tasksTitle = ref('');
const fgColor = ref('--b1');
const date = ref<Date>();

const taskGroupMenuOpen = ref(false);
const isTaskGroupPage = ref(false);
const taskGroupEntity = ref<TaskGroupEntity | undefined>();

const menuOpen = ref(false);

const datepickerOpen = ref(false);

const multiSelectMode = ref(false);
const multiSelectMenuOpen = ref(false);

const showTitle = ref(true);

const scrollEle = ref<HTMLElement | undefined | null>();
const multiSelectMenuBtn = ref<HTMLButtonElement | null>(null);

let dateWatcher: WatchStopHandle | undefined = undefined;

moment.locale(i18n.locale.value);

// 当菜单打开状态改变
watch(menuOpen, (newVal) => {
  if (newVal) {
    menuController.open();
  } else {
    menuController.close();
  }
});

function onClickCloseBtn() {
  appStore.eventBus.emit(EventType.DISABLED_TASK_CARD_MULTI_SELECTION_MODE_EVENT, {});
}

function onClickDeleteBtn() {
  appStore.eventBus.emit(EventType.CLICK_DELETE_TASK_BUTTON_EVENT, {});
}

/**
 * 更新Navbar的标题日期
 * @param dateMoment 日期
 */
function updateNavbarDate(dateMoment: Moment) {
  if (dateMoment.isSame(moment(), 'day')) {
    tasksTitle.value = 'today';
  } else if (!dateMoment.isSame(moment(), 'year')) {
    tasksTitle.value = dateMoment.format('LL');
  } else {
    tasksTitle.value = dateMoment.format('MMMDo');
  }
}

/**
 * 进入日任务模式
 */
function inDayTaskPage(route: RouteLocationNormalized) {
  if (taskGroupEntity.value !== undefined) taskGroupEntity.value = undefined;

  // 日期格式校验
  const dateStr = route.params.date;
  const dateMoment = moment(dateStr, 'YYYY-MM-DD');
  if (dateMoment.isValid()) {
    // 日期有效
    updateNavbarDate(dateMoment);
    date.value = dateMoment.toDate();
  } else {
    tasksTitle.value = 'today';
    date.value = moment().toDate();
  }

  // 当Datepicker值发生变化
  dateWatcher = watch(date, (value) => {
    const dateMoment = moment(value);
    updateNavbarDate(dateMoment);
    // 导航到指定日期的任务列表
    if (dateMoment.isSame(moment(), 'day')) {
      router.replace('/');
    } else {
      router.replace('/tasks/day/' + dateMoment.format('YYYY-MM-DD'));
    }
  });
}

async function inTaskGroupPage(route: RouteLocationNormalized) {
  if (date.value !== undefined) date.value = undefined;

  const taskGroupId = route.params.taskGroupId;
  if (typeof taskGroupId !== 'string') return;
  const taskGroup: TaskGroupEntity | null = await dbUtils.getTaskGroupEntityRepository()?.findOne({ where: { id: taskGroupId }});
  if (taskGroup === null) {
    // 任务组不存在
    tasksTitle.value = i18n.t('page.tasks.notFoundTaskGroup');
    return;
  }

  isTaskGroupPage.value = true;
  tasksTitle.value = '';
  taskGroupEntity.value = taskGroup;

  initForegroundColor();
}

/**
 * 获取背景颜色以设置前景颜色
 */
function initForegroundColor() {
  if (taskGroupEntity.value?.color === undefined) return;
  fgColor.value = fun.getForegroundColor(typeof taskGroupEntity.value!.color === "string" ? taskGroupEntity.value!.color : '');
}

function updateNavbar(route: RouteLocationNormalized) {
  fgColor.value = '--b1';
  menuOpen.value = false;
  datepickerOpen.value = false;
  showTitle.value = true;

  // 获取日任务路由参数的日期
  if (route.params.date) {
    // 存在日期参数
    inDayTaskPage(route);
  } else if (route.params.taskGroupId) {
    // 存在任务组参数
    inTaskGroupPage(route);
  } else if (route.name === 'tasks') {
    inDayTaskPage(route);
  }
}

/**
 * 滚动元素初始化完成事件回调
 */
const onScrollInitialized = () => {
  const scrollContent = document.getElementById('main-scroll-content');
  if (scrollContent !== null) {
    scrollEle.value = scrollContent.parentElement;
  } else {
    scrollEle.value = undefined;
    console.warn('Could not find scroll element');
  }
}

const onEnableMultiSelectMode = () => {
  multiSelectMode.value = true;
}

const onDisableMultiSelectMode = () => {
  multiSelectMode.value = false;
}

const onTaskGroupInfoVisible = () => {
  showTitle.value = false;
}

const onTaskGroupInfoHidden = () => {
  showTitle.value = true;
}

onMounted(() => {
  updateNavbar(router.currentRoute.value);

  // 获取滚动元素
  appStore.eventBus.on(EventType.MAIN_SCROLL_INITIALIZED_EVENT, onScrollInitialized);

  // 监听多选模式
  appStore.eventBus.on(EventType.ENABLED_TASK_CARD_MULTI_SELECTION_MODE_EVENT, onEnableMultiSelectMode);
  appStore.eventBus.on(EventType.DISABLED_TASK_CARD_MULTI_SELECTION_MODE_EVENT, onDisableMultiSelectMode);

  // 监听TaskGroupInfo是否可视
  appStore.eventBus.on(EventType.TASK_GROUP_INFO_VISIBLE_EVENT, onTaskGroupInfoVisible);
  appStore.eventBus.on(EventType.TASK_GROUP_INFO_HIDDEN_EVENT, onTaskGroupInfoHidden);

});

onUnmounted(() => {
  appStore.eventBus.off(EventType.MAIN_SCROLL_INITIALIZED_EVENT, onScrollInitialized);
  appStore.eventBus.off(EventType.ENABLED_TASK_CARD_MULTI_SELECTION_MODE_EVENT, onEnableMultiSelectMode);
  appStore.eventBus.off(EventType.DISABLED_TASK_CARD_MULTI_SELECTION_MODE_EVENT, onDisableMultiSelectMode);
  appStore.eventBus.off(EventType.TASK_GROUP_INFO_VISIBLE_EVENT, onTaskGroupInfoVisible);
  appStore.eventBus.off(EventType.TASK_GROUP_INFO_HIDDEN_EVENT, onTaskGroupInfoHidden);
});

router.afterEach((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  // 停止监听日期变化
  if (dateWatcher !== undefined) dateWatcher();

  pageName.value = to.name;
  updateNavbar(to);
});

</script>

<style scoped lang="less">

</style>
