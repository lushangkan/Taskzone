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
          <div class="w-[82%] pb-[50px] pt-[115px] flex flex-col justify-start items-center">
            <draggable v-model="undoneTasks" item-key="id"
                       tag="transition-group" :component-data="
                       {
                         name: !isDragging ? 'task-card' : null,
                         tag: 'div',
                         class: `w-full flex flex-col justify-start items-center bg-base-100 gap-[15px]`
                       }"
                       animation="200" handle=".drag-handle"
                       @start="onDragStart" @end="onDragEnd"
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
                         class: `w-full flex flex-col justify-start items-center bg-base-100 gap-[15px]`
                       }"
                       animation="200" handle=".drag-handle"
                       @start="onDragStart" @end="onDragEnd"
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
import {RouteLocationNormalized, useRouter} from "vue-router";
import * as dbUtils from "@/data/database/utils/database-utils";
import {TaskGroupEntity} from "@/data/database/entities/TaskGroupEntity";

const appStore = useAppStores();
const dbStore = useDatabaseStores();

const router = useRouter();

const undoneTasks: Ref<TaskEntity[]> = ref([]);
const doneTasks: Ref<TaskEntity[]> = ref([]);

const taskGroupEntity: Ref<TaskGroupEntity | undefined> = ref();

const isDragging = ref(false);

const multiSelectMode = ref(false);
/**
 * 数据库更新后的回调, 更新任务列表
 */
const updateTasks = async () => {
  // 更新任务
  const result = (await DbUtils.getTaskEntityRepository()?.find({
    relations: {
      tags: true
    }
  }))!;

  undoneTasks.value = result.filter((task) => !task.isDone);
  doneTasks.value = result.filter((task) => task.isDone);
}

const updateTaskGroup = async () => {
  // 更新任务组状态
  if (taskGroupEntity.value !== undefined) {
    const taskGroupRepository = dbUtils.getTaskGroupEntityRepository();
    const result: TaskGroupEntity | null = await taskGroupRepository?.findOneById(taskGroupEntity.value!.id);
    if (result === null) router.push("/");
  }
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

function onDragStart() {
  appStore.eventBus.emit(EventType.DRAGGING_TASK_CARD_EVENT, {});
  isDragging.value = true;
}

function onDragEnd() {
  appStore.eventBus.emit(EventType.DRAG_TASK_CARD_END_EVENT, {});
  isDragging.value = false;
}

const multiSelectDeleteTasksCallback = async () => {
  for (const task of appStore.selectedTasks) {
    await dbStore.entityManager!.remove(Object.assign(new TaskEntity(), task));
  }

  appStore.eventBus.emit(EventType.DISABLED_TASK_CARD_MULTI_SELECTION_MODE_EVENT, {});
};

async function inTaskGroupPage(route: RouteLocationNormalized) {
  const taskGroupRepository = dbUtils.getTaskGroupEntityRepository();
  if (typeof route.params.taskGroupId !== 'string') return;
  const result: TaskGroupEntity | null = await taskGroupRepository?.findOne({ where: { id: route.params.taskGroupId }});
  taskGroupEntity.value = result === null ? undefined : result;
}

async function inDayTaskPage(route: RouteLocationNormalized) {

}

onMounted(() => {
  if (router.currentRoute.value.name === 'tasks' && router.currentRoute.value.params.taskGroupId) {
    inTaskGroupPage(router.currentRoute.value);
  } else if (router.currentRoute.value.name === 'tasks' && router.currentRoute.value.params.date) {
    inDayTaskPage(router.currentRoute.value);
  } else if (router.currentRoute.value.name === 'tasks' && (router.currentRoute.value.path === "/" || router.currentRoute.value.path === "")) {
    inDayTaskPage(router.currentRoute.value);
  }

  // 清空多选任务
  appStore.selectedTasks = [];

  // 初始化任务列表
  updateTasks().then(() => {
    // 监听数据库更新事件
    appStore.eventBus.on(EventType.DB_ALL, updateTasks);
    appStore.eventBus.on(EventType.DB_AFTER_REMOVE, updateTaskGroup);
    appStore.eventBus.on(EventType.DB_AFTER_SOFT_REMOVE, updateTaskGroup);
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

router.afterEach((to) =>{
  if (to.name === 'tasks' && to.params.taskGroupId) {
    inTaskGroupPage(to);
  } else if (to.name === 'tasks' && to.params.date) {
    inDayTaskPage(to);
  } else if (to.name === 'tasks' && (to.path === "/" || to.path === "")) {
    inDayTaskPage(to);
  }
});

</script>


<style scoped lang="less">

</style>
