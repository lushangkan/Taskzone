<template>
  <sticky-element :scrollElement="scrollEle" stuckClass="navbar-stuck" showClass="navbar-show" transitionClass="navbar-transition" id="sticky-navbar">
    <div id="app-navbar" class="fixed flex flex-col justify-start items-center w-full py-[16px] z-10">
      <ion-header
          class="relative border-none w-[348px] h-[63px] px-[13px] rounded-3xl navbar-shadow bg-gradient-to-br from-[hsl(var(--p--100))] to-[hsl(var(--p-300))]" :style="`${taskGroupColor !== undefined? `background: ${taskGroupColor}`:''}`">
        <div v-if="!multiSelectMode" class="w-full h-full flex flex-row justify-between items-center px-0">
          <div class="navbar-start w-[56px] h-[48px]">
            <button type="button" title="Open menu" :class="`w-[56px] h-[48px] d-btn d-btn-ghost ${menuOpen?'d-btn-active':''}`"
                    @click="menuOpen=!menuOpen">
              <menu-icon class="w-[24px] h-[24px]" color="hsl(var(--b1))"/>
            </button>
          </div>
          <div class="navbar-center">
            <div class="flex flex-row justify-center items-center gap-[3px]">
              <span v-if="taskGroupIcon !== undefined" class="text-[25px]">{{ taskGroupIcon }}</span>
              <span class="whitespace-nowrap text-base-100 text-lg font-medium">{{
                  pageName === 'tasks' ? tasksTitle === 'today' ? i18n.t('page.tasks.today') : tasksTitle : i18n.t(`page.${pageName}.name`, i18n.t('page.pageNotFound'))
                }}
              </span>
            </div>
          </div>
          <div class="navbar-end w-[56px] h-[48px]">
            <button v-show="pageName==='tasks' && date !== undefined" type="button" title="Open datepicker"
                    :class="`w-[56px] h-[48px] d-btn d-btn-ghost ${datepickerOpen?'d-btn-active':''}`"
                    @click="datepickerOpen=!datepickerOpen">
              <calendar-days-icon class="w-[24px] h-[24px]" color="hsl(var(--b1))"/>
            </button>
          </div>
        </div>
        <div v-if="multiSelectMode" class="w-full h-full flex flex-row justify-end items-center px-0">
          <div class="navbar-end relative">
            <button type="button" title="Close multi select mode"
                    class="d-btn d-btn-ghost" @click="onClickCloseBtn">
              <x class="stroke-base-100 w-[24px] h-[24px]"/>
            </button>
            <button type="button" title="Delete task"
                    class="d-btn d-btn-ghost" @click="onClickDeleteBtn">
              <trash2 class="stroke-base-100 w-[24px] h-[24px]"/>
            </button>
            <button ref="multiSelectMenuBtn" type="button" title="More" :class="`d-btn d-btn-ghost ${multiSelectMenuOpen?'d-btn-active':''}`" @click="multiSelectMenuOpen=!multiSelectMenuOpen">
              <more-horizontal class="stroke-base-100 w-[24px] h-[24px]"/>
            </button>
            <ul ref="multiSelectMenu" v-if="multiSelectMenuOpen" class="absolute w-[112px] right-0 mt-[20px] gap-[3px] navbar-multiple-selection-menu d-dropdown-content d-menu bg-base-100 rounded-box">
              <li v-if="appStore.selectedTasks.length === 1" @click="onClickEditBtn">
                <div class="flex flex-row justify-around items-center">
                  <pen-line class="stroke-inherit w-[19px] h-[19px]"/>
                  <span class="text-inherit text-sm font-medium">编辑</span>
                </div>
              </li>
              <li @click="onClickCopyBtn">
                <div class="flex flex-row justify-around items-center">
                  <clipboard-paste class="stroke-inherit w-[19px] h-[19px]"/>
                  <span class="text-inherit text-sm font-medium">复制</span>
                </div>
              </li>
              <li @click="onClickMoveBtn">
                <div class="flex flex-row justify-around items-center">
                  <folder-output class="stroke-inherit w-[19px] h-[19px]"/>
                  <span class="text-inherit text-sm font-medium">移动</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </ion-header>
      <Transition name="datepicker">
        <navbar-datepicker v-if="datepickerOpen" v-model="date"/>
      </Transition>
    </div>
  </sticky-element>
  <side-panel @onmenuclose="menuOpen=false" class="w-full h-full z-20"/>
  <slot/>
</template>

<script setup lang="ts">
import {IonHeader, IonTitle, menuController} from "@ionic/vue";
import {CalendarDaysIcon, MenuIcon, X, PenLine, Trash2, MoreHorizontal, ClipboardPaste, FolderOutput} from 'lucide-vue-next';
import {onMounted, onUnmounted, type Ref, ref, watch} from "vue";
import {useRouter} from "vue-router";
import SidePanel from "@/componrnts/navbar/SidePanel.vue";
import NavbarDatepicker from "@/componrnts/navbar/NavbarDatepicker.vue";
import StickyElement from 'vue-sticky-element';
import {useAppStores} from "@/stores/app-stores";
import anime from 'animejs/lib/anime.es.js';
import {useI18n} from "vue-i18n";
import moment from "moment";
import {Moment} from "moment";
import "moment/dist/locale/zh-cn.js";
import EventType from "@/event/EventType";
import * as fun from "@/utils/fun";
import {TaskGroupEntity} from "@/data/database/entities/TaskGroupEntity";
import * as dbUtils from "@/data/database/utils/database-utils";

const i18n = useI18n();
const router = useRouter();
const appStore = useAppStores();

const pageName = ref(router.currentRoute.value.name);
const tasksTitle = ref('');
const taskGroupIcon = ref<string | undefined>(undefined);
const taskGroupColor = ref<string | undefined>(undefined);
const date = ref<Date>();
const menuOpen = ref(false);
const datepickerOpen = ref(false);
const multiSelectMenuOpen = ref(false);
const multiSelectMode = ref(false);

const scrollEle = ref<HTMLElement | undefined | null>();
const multiSelectMenu = ref<HTMLUListElement | null>(null)
const multiSelectMenuBtn = ref<HTMLButtonElement | null>(null)

moment.locale(i18n.locale.value);

// 当菜单打开状态改变
watch(menuOpen, (newVal) => {
  if (newVal) {
    menuController.open();
  } else {
    menuController.close();
  }
});

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

function onClickCloseBtn() {
  appStore.eventBus.emit(EventType.DISABLED_TASK_CARD_MULTI_SELECTION_MODE_EVENT, {});
}

function onClickDeleteBtn() {
  appStore.eventBus.emit(EventType.CLICK_DELETE_TASK_BUTTON_EVENT, {});
}

function onClickEditBtn() {
  appStore.eventBus.emit(EventType.CLICK_EDIT_TASK_BUTTON_EVENT, {});
}

function onClickMoveBtn() {
  appStore.eventBus.emit(EventType.CLICK_MOVE_TASK_BUTTON_EVENT, {});
}

function onClickCopyBtn() {
  appStore.eventBus.emit(EventType.CLICK_COPY_TASK_BUTTON_EVENT, {});
}

const onClickWindowCallback = (event: UIEvent) => {
  if (multiSelectMenuOpen.value && (!(event.target as HTMLElement).isEqualNode(multiSelectMenu.value!) && !fun.isChildOf(event.target as HTMLElement, multiSelectMenu.value!)) && (!(event.target as HTMLElement).isEqualNode(multiSelectMenuBtn.value) && !fun.isChildOf(event.target as HTMLElement, multiSelectMenuBtn.value!))) {
    // 点击在多选菜单之外
    multiSelectMenuOpen.value = false;
  }
};

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
function inDayTaskPage() {
  if (taskGroupIcon.value !== undefined) taskGroupIcon.value = undefined;
  if (taskGroupColor.value !== undefined) taskGroupColor.value = undefined;

  // 日期格式校验
  const dateStr = router.currentRoute.value.params.date;
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
  watch(date, (value) => {
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

async function inTaskGroupPage() {
  if (date.value !== undefined) date.value = undefined;

  const taskGroupId = router.currentRoute.value.params.taskGroupId;
  if (typeof taskGroupId !== 'string') return;
  const taskGroup: TaskGroupEntity | null = await dbUtils.getTaskGroupEntityRepository()?.findOne({ where: { id: taskGroupId }});
  if (taskGroup === null) {
    // 任务组不存在
    tasksTitle.value = i18n.t('page.tasks.notFoundTaskGroup');
    return;
  }

  typeof taskGroup.name === "string" ? tasksTitle.value = taskGroup.name : undefined;
  typeof taskGroup.icon === "string" ? taskGroupIcon.value = taskGroup.icon : undefined;
  typeof taskGroup.color === "string" ? taskGroupColor.value = taskGroup.color : undefined;
}

onMounted(() => {
  // 获取日任务路由参数的日期
  if (router.currentRoute.value.params.date) {
    // 存在日期参数
    inDayTaskPage();
  } else if (router.currentRoute.value.params.taskGroupId) {
    // 存在任务组参数
    inTaskGroupPage();
  } else if (pageName.value === 'tasks') {
    inDayTaskPage();
  }

  // 获取滚动元素
  appStore.eventBus.on(EventType.MAIN_SCROLL_INITIALIZED_EVENT, onScrollInitialized);

  // 监听多选模式
  appStore.eventBus.on(EventType.ENABLED_TASK_CARD_MULTI_SELECTION_MODE_EVENT, () => multiSelectMode.value = true);
  appStore.eventBus.on(EventType.DISABLED_TASK_CARD_MULTI_SELECTION_MODE_EVENT, () => multiSelectMode.value = false);

  // 监听窗口点击事件
  window.addEventListener('click', onClickWindowCallback);
});

onUnmounted(() => {
  appStore.eventBus.off(EventType.MAIN_SCROLL_INITIALIZED_EVENT, onScrollInitialized);
});

</script>

<style scoped lang="less">

</style>
