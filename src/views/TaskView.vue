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
                           :task-entity="element" @on-complete-change="onCompletedChange"/>
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
import {onMounted, Ref, ref} from "vue";
import {TaskEntity} from "@/data/database/entities/TaskEntity";
import {useDatabaseStores} from "@/stores/database-stores";
import * as DbUtils from "@/data/database/utils/database-utils";
import draggable from 'zhyswan-vuedraggable'
import {Event} from "happy-dom";
import EventType from "@/event/EventType";


const appStore = useAppStores();

const undoneTasks: Ref<TaskEntity[]> = ref([]);
const doneTasks: Ref<TaskEntity[]> = ref([]);

const isDragging = ref(false);

// 监听数据表变化
const updateTasks = async () => {
  const result = (await DbUtils.getTaskEntityRepository()?.find({
    relations: {
      tags: true
    }
  }))!;

  undoneTasks.value = result.filter((task) => !task.isDone);
  doneTasks.value = result.filter((task) => task.isDone);
}

function scrollInitialized() {
  appStore.eventBus.emit(EventType.MAIN_SCROLL_INITIALIZED_EVENT, {});
}

function onCompletedChange(isDone: boolean) {
  updateTasks();
}

onMounted(() => {
  updateTasks().then(() => {
    appStore.eventBus.on(EventType.DB_ALL, updateTasks);
  });
});

</script>


<style scoped lang="less">

</style>
