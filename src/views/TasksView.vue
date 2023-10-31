<template>
  <ion-page class="bg-base-300">
    <ion-content :fullscreen="true" :scroll-events=true >
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
        <div id="main-scroll-content" class="w-full flex flex-col justify-center items-center bg-base-100">
          <div class="w-[82%] pb-[50px] pt-[115px] flex flex-col justify-start items-center gap-[30px]">
            <task-group-info v-if="taskGroupEntity !== undefined && taskGroupEntity !== null && taskGroupEntity.dayTaskDate === null" :task-group-entity="taskGroupEntity"/>
            <draggable :list="undoneTasks" item-key="id"
                       tag="transition-group" :component-data="
                       {
                         name: !isDragging && !updatingTask ? 'task-card' : null,
                         tag: 'div',
                         class: `w-full flex flex-col justify-start items-center bg-base-100 gap-[15px]`
                       }"
                       animation="200" handle=".drag-handle"
                       @start="onDragStart" @end="onDragEnd(ListType.UNDONE)"
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
            <div v-if="undoneTasks.length !== 0 && doneTasks.length !== 0" class="w-[90%] flex flex-row justify-around items-center gap-[10px]">
              <span class="text-neutral font-light text-[13px] whitespace-nowrap">{{ $t('taskView.completed') }}</span>
              <div class="w-full border-t border-base-300/80"/>
            </div>
            <draggable :list="doneTasks" item-key="id"
                       tag="transition-group" :component-data="
                       {
                         name: !isDragging && !updatingTask ? 'task-card' : null,
                         tag: 'div',
                         class: `w-full flex flex-col justify-start items-center bg-base-100 gap-[15px]`
                       }"
                       animation="200" handle=".drag-handle"
                       @start="onDragStart" @end="onDragEnd(ListType.DONE)"
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
import * as dbUtils from "@/data/database/utils/database-utils";
import draggable from 'zhyswan-vuedraggable'
import EventType from "@/event/EventType";
import {useDatabaseStores} from "@/stores/database-stores";
import {RouteLocationNormalized, useRouter} from "vue-router";
import {TaskGroupEntity} from "@/data/database/entities/TaskGroupEntity";
import moment from "moment";
import TaskGroupInfo from "@/componrnts/TaskGroupInfo.vue";

const appStore = useAppStores();
const dbStore = useDatabaseStores();

const router = useRouter();

const undoneTasks: Ref<TaskEntity[]> = ref([]);
const doneTasks: Ref<TaskEntity[]> = ref([]);

const taskGroupEntity: Ref<TaskGroupEntity | null> = ref(null);

const isDragging = ref(false);

const multiSelectMode = ref(false);

const updatingTask = ref(false);

let taskGroupId: string | undefined = undefined;

enum ListType {
  DONE = 'done',
  UNDONE = 'undone'
}

/**
 * 数据库更新后的回调, 更新任务列表
 */
const updateTasks = async () => {
  if (taskGroupId === undefined) return;

  // 更新任务
  // 未知类型错误，必须使用@ts-ignore，使用后运行正常，请勿移除
  // @ts-ignore
  taskGroupEntity.value = (await DbUtils.getTaskGroupEntityRepository()?.findOne({
    where: {
      id: taskGroupId
    },
    relations: {
      tasks: {
        tags: true
      },
      tags: true,
    }
  }))!;

  const tasks: (TaskEntity | null)[] | undefined  = taskGroupEntity.value?.tasks;

  if (tasks === undefined) return;

  undoneTasks.value = tasks.filter((task) => {
    if (task === null) return false;
    return !task.isDone;
  }) as TaskEntity[];

  doneTasks.value = tasks.filter((task) => {
    if (task === null) return false;
    return task.isDone;
  }) as TaskEntity[];


  // 排序

  let updateOrder = false;

  if (taskGroupEntity.value?.order === undefined || taskGroupEntity.value?.order === null) {
    taskGroupEntity.value!.order = {
      undone: [],
      done: []
    };
    updateOrder = true;
  }

  if (taskGroupEntity.value?.order?.done === undefined || (taskGroupEntity.value?.order.done.length === 0 && doneTasks.value.length !== 0)) {
    // order.done未空，而doneTasks不为空，说明是第一次加载，生成order.done
    taskGroupEntity.value!.order!.done = doneTasks.value.map((task) => task.id);
    updateOrder = true;
  }

  if (taskGroupEntity.value?.order?.undone === undefined || (taskGroupEntity.value?.order.undone.length === 0 && undoneTasks.value.length !== 0)) {
    // order.undone未空，而undoneTasks不为空，说明是第一次加载，生成order.undone
    taskGroupEntity.value!.order!.undone = undoneTasks.value.map((task) => task.id);
    updateOrder = true;
  }

  if (taskGroupEntity.value?.order?.done.length < doneTasks.value.length) {
    // order.done长度小于doneTasks长度，说明有新的任务添加，更新order.done
    // 寻找新增的任务
    const newTasks = doneTasks.value.filter((task) => {
      return !taskGroupEntity.value!.order!.done.includes(task.id);
    });
    // 添加到尾部
    taskGroupEntity.value!.order!.done.push(...newTasks.map((task) => task.id));
    updateOrder = true;
  }

  if (taskGroupEntity.value?.order?.undone.length < undoneTasks.value.length) {
    // order.undone长度小于undoneTasks长度，说明有新的任务添加，更新order.undone
    // 寻找新增的任务
    const newTasks = undoneTasks.value.filter((task) => {
      return !taskGroupEntity.value!.order!.undone.includes(task.id);
    });
    // 添加到尾部
    taskGroupEntity.value!.order!.undone.push(...newTasks.map((task) => task.id));
    updateOrder = true;
  }

  // 将order.done的顺序应用到doneTasks
  const newDoneTasks: TaskEntity[] = [];
  for (const taskId of taskGroupEntity.value!.order!.done) {
    const task: TaskEntity | undefined = doneTasks.value.find((task) => task.id === taskId);
    if (task === undefined) {
      // 没有找到对应的任务，说明该任务已被删除，从order.done中移除
      taskGroupEntity.value!.order!.done.splice(taskGroupEntity.value!.order!.done.indexOf(taskId), 1);
      updateOrder = true;
      continue;
    }
    newDoneTasks.push(task);
  }

  // 将order.undone的顺序应用到undoneTasks
  const newUndoneTasks: TaskEntity[] = [];
  for (const taskId of taskGroupEntity.value!.order!.undone) {
    const task: TaskEntity | undefined = undoneTasks.value.find((task) => task.id === taskId);
    if (task === undefined) {
      // 没有找到对应的任务，说明该任务已被删除，从order.undone中移除
      taskGroupEntity.value!.order!.undone.splice(taskGroupEntity.value!.order!.undone.indexOf(taskId), 1);
      updateOrder = true;
      continue;
    }
    newUndoneTasks.push(task);
  }

  // 应用到变量
  undoneTasks.value = newUndoneTasks;
  doneTasks.value = newDoneTasks;

  if (updateOrder) {
    // 更新数据库
    await dbUtils.getTaskGroupEntityRepository()?.update(taskGroupEntity.value!.id, {
      order: taskGroupEntity.value!.order
    });
  }
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

function onDragStart(listType: ListType) {
  appStore.eventBus.emit(EventType.DRAGGING_TASK_CARD_EVENT, {});
  isDragging.value = true;
}

function onDragEnd(listType: ListType) {
  // 排序结束，保存到数据库
  let updateOrder = false;

  if (listType === ListType.DONE) {
    const doneList = doneTasks.value.map((task) => task.id);
    // 判断是否有变化
    if (doneList.toString() !== taskGroupEntity.value!.order!.done.toString()) {
      taskGroupEntity.value!.order!.done = doneList;
      updateOrder = true;
    }
  } else if (listType === ListType.UNDONE) {
    const undoneList = undoneTasks.value.map((task) => task.id);
    // 判断是否有变化
    if (undoneList.toString() !== taskGroupEntity.value!.order!.undone.toString()) {
      taskGroupEntity.value!.order!.undone = undoneList;
      updateOrder = true;
    }
  }

  if (updateOrder) {
    // 更新数据库
    dbUtils.getTaskGroupEntityRepository()?.update(taskGroupEntity.value!.id, {
      order: taskGroupEntity.value!.order
    });
  }

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
  taskGroupId = undefined;
  taskGroupEntity.value = null;

  // 获取TaskGroupId
  const taskGroupRepository = dbUtils.getTaskGroupEntityRepository();

  if (typeof route.params.taskGroupId !== 'string') return;

  const result: TaskGroupEntity | null = await taskGroupRepository?.findOne({ where: { id: route.params.taskGroupId }});
  // TODO: 跳转到404页
  if (result === null) return;

  // 判断是否为日任务，如果是则跳转到日任务页面
  if (result.dayTaskDate !== null) {
    router.push('/tasks/day/' + moment(result.dayTaskDate).format('YYYY-MM-DD'));
    return;
  }

  taskGroupId = result?.id;

  // 初始化任务列表
  await updateTasks()
}

async function inDayTaskPage(route: RouteLocationNormalized) {
  taskGroupId = undefined;

  // 获取日期
  let date: Date | undefined = undefined;

  if (route.params.date) {
    const momDate = moment(route.params.date, 'YYYY-MM-DD', true);
    if (momDate.isValid()) {
      date = momDate.startOf('day').toDate();
    }
  } else {
    date = moment().startOf('day').toDate();
  }

  // TODO: 跳转到404页
  if (date === undefined) return;

  // 获取Id
  let result: TaskGroupEntity | null = (await dbUtils.getTaskGroupEntityRepository()?.findOne({
    where: {
      dayTaskDate: date
    },
    relations: {
      tasks: true,
      tags: true
    }
  }));

  if (result === null) {
    // 找不到则新建
    result = await dbUtils.checkDayTaskGroup(date);

    // TODO: 跳转到404页
    if (result === null || result === undefined) return;
  }

  taskGroupId = result.id;

  // 初始化任务列表
  await updateTasks()
}

onMounted(() => {
  updatingTask.value = true;

  if (router.currentRoute.value.name === 'tasks' && router.currentRoute.value.params.taskGroupId) {
    inTaskGroupPage(router.currentRoute.value).then(() => updatingTask.value = false);
  } else if (router.currentRoute.value.name === 'tasks' && router.currentRoute.value.params.date) {
    inDayTaskPage(router.currentRoute.value).then(() => updatingTask.value = false);
  } else if (router.currentRoute.value.name === 'tasks' && (router.currentRoute.value.path === "/" || router.currentRoute.value.path === "")) {
    inDayTaskPage(router.currentRoute.value).then(() => updatingTask.value = false);
  }

  // 清空多选任务
  appStore.selectedTasks = [];

  // 监听多选模式
  appStore.eventBus.on(EventType.ENABLED_TASK_CARD_MULTI_SELECTION_MODE_EVENT, () => multiSelectMode.value = true);
  appStore.eventBus.on(EventType.DISABLED_TASK_CARD_MULTI_SELECTION_MODE_EVENT, () => multiSelectMode.value = false);
  appStore.eventBus.on(EventType.CLICK_DELETE_TASK_BUTTON_EVENT, multiSelectDeleteTasksCallback);

  // 监听数据库更新事件
  appStore.eventBus.on(EventType.DB_ALL, updateTasks);
  appStore.eventBus.on(EventType.DB_AFTER_REMOVE, updateTaskGroup);
  appStore.eventBus.on(EventType.DB_AFTER_SOFT_REMOVE, updateTaskGroup);
});

onUnmounted(() => {
  // 清空多选任务
  appStore.selectedTasks = [];
});

router.afterEach((to) =>{
  updatingTask.value = true;

  if (to.name === 'tasks' && to.params.taskGroupId) {
    inTaskGroupPage(to).then(() => updatingTask.value = false);
  } else if (to.name === 'tasks' && to.params.date) {
    inDayTaskPage(to).then(() => updatingTask.value = false);
  } else if (to.name === 'tasks' && (to.path === "/" || to.path === "")) {
    inDayTaskPage(to).then(() => updatingTask.value = false);
  }
});

</script>


<style scoped lang="less">

</style>
