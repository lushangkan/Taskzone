<template>
  <ion-page class="bg-base-300">
    <ion-content :fullscreen="true" :scroll-events=true class="custom-scroll-bar">
      <overlay-scrollbars-component id="main-scroll" defer element="div" :options="{
          overflow: {
            x: 'hidden',
          },
          scrollbars: {
            autoHide: 'leave',
            autoHideDelay: 200,
            clickScroll: true,
            theme: 'os-theme-dark',
          }
        }" class="w-full h-full" @os-initialized="scrollInitialized"
      >
        <div id="main-scroll-content" class="w-full flex flex-col justify-center items-center">
          <div class="w-[82%] pb-[50px] flex flex-col justify-start items-center">
            <draggable v-model="undoneTasks" item-key="id"
                       tag="transition-group" :component-data="
                       {
                         name: !isDragging ? 'task-card' : null,
                         tag: 'div',
                         class: `${undoneTasks.length !== 0? 'pt-[115px]':''} w-full flex flex-col justify-start items-center bg-base-100 gap-[15px]`
                       }"
                       animation="200" handle=".drag-handle"
                       @start="isDragging = true" @end="isDragging = false"
                       delay="100"
            >
              <template #item="{element}">
                <div class="list-group-item w-full">
                  <task-card class="h-[62px] w-[95%]"
                           :task-entity="element" @on-complete-change="onCompletedChange"
                  />
                </div>
              </template>
            </draggable>
            <div v-if="undoneTasks.length !== 0" class="w-[90%] flex flex-row justify-around items-center gap-[10px] my-[25px]">
              <span class="text-neutral font-light text-[13px] whitespace-nowrap">{{ $t('taskView.completed') }}</span>
              <div class="w-full border-t border-base-300/80"/>
            </div>
            <draggable v-model="doneTasks" item-key="id"
                       tag="transition-group" :component-data="
                       {
                         name: !isDragging ? 'task-card' : null,
                         tag: 'div',
                         class: `${undoneTasks.length === 0 && doneTasks.length !== 0? 'pt-[115px]':''} w-full flex flex-col justify-start items-center bg-base-100 gap-[15px]`
                       }"
                       animation="200" handle=".drag-handle"
                       @start="isDragging = true" @end="isDragging = false"
                       delay="100"
            >
              <template #item="{element}">
                <div class="list-group-item w-full">
                  <task-card class="h-[62px] w-[95%] greyscale-90"
                             :task-entity="element" @on-complete-change="onCompletedChange"/>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </overlay-scrollbars-component>
    </ion-content>
    <add-task-btn/>
  </ion-page>
</template>

<script setup lang="ts">
import {IonContent, IonPage} from "@ionic/vue";
import AddTaskBtn from "@/componrnts/AddTaskBtn.vue";
import {OverlayScrollbarsComponent} from "overlayscrollbars-vue";
import {useAppStores} from "@/stores/app-stores";
import TaskCard from "@/componrnts/TaskCard.vue";
import {onMounted, onUnmounted, Ref, ref} from "vue";
import {TaskEntity} from "@/data/database/entities/TaskEntity";
import * as DbUtils from "@/data/database/utils/database-utils";
import draggable from 'zhyswan-vuedraggable'
import EventType from "@/event/EventType";
import {useDatabaseStores} from "@/stores/database-stores";

const appStore = useAppStores();
const dbStore = useDatabaseStores();

const undoneTasks: Ref<TaskEntity[]> = ref([]);
const doneTasks: Ref<TaskEntity[]> = ref([]);

const isDragging = ref(false);

const multiSelectMode = ref(false);

/**
 * 数据库更新后的回调, 更新任务列表
 */
const updateTasks = async () => {
  const result = (await DbUtils.getTaskEntityRepository()?.find({
    relations: {
      tags: true
    }
  }))!;

  undoneTasks.value = result.filter((task) => !task.isDone);
  doneTasks.value = result.filter((task) => task.isDone);
}


/**
 * 虚拟滚动条初始化完成后,触发MAIN_SCROLL_INITIALIZED_EVENT事件，以初始化 stick TopNavbar 和 stick AddTaskBtn
 */
function scrollInitialized() {
  appStore.eventBus.emit(EventType.MAIN_SCROLL_INITIALIZED_EVENT, {});
}

/**
 * 任务完成状态改变后的回调
 * @param isDone
 */
function onCompletedChange(isDone: boolean) {
  // 更新任务列表
  updateTasks();
}

const multiSelectDeleteTasksCallback = async () => {
  for (const task of appStore.selectedTasks) {
    await dbStore.entityManager!.remove(Object.assign(new TaskEntity(), task));
  }

  appStore.eventBus.emit(EventType.DISABLED_TASK_CARD_MULTI_SELECTION_MODE_EVENT, {});
};

onMounted(() => {
  // 清空多选任务
  appStore.selectedTasks = [];

  // 初始化任务列表
  updateTasks().then(() => {
    // 监听数据库更新事件
    appStore.eventBus.on(EventType.DB_ALL, updateTasks);
  });

  // 监听多选模式
  appStore.eventBus.on(EventType.ENABLED_TASK_CARD_MULTI_SELECTION_MODE_EVENT, () => multiSelectMode.value = true);
  appStore.eventBus.on(EventType.DISABLED_TASK_CARD_MULTI_SELECTION_MODE_EVENT, () => multiSelectMode.value = false);
  appStore.eventBus.on(EventType.CLICK_DELETE_TASK_BUTTON_EVENT, multiSelectDeleteTasksCallback);
});

onUnmounted(() => {
  // 清空多选任务
  appStore.selectedTasks = [];
});

</script>


<style scoped lang="less">

</style>
