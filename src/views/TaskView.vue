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
            <TransitionGroup name="task-card" tag="div" :class="`${undoneTasks.length !== 0? 'pt-[115px]':''} w-full flex flex-col justify-start items-center bg-base-100 gap-[15px]`">
              <task-card v-for="task in undoneTasks" v-bind:key="task.id"
                         class="h-[62px] w-[95%]"
                         :task-entity="task" @on-complete-change="onCompletedChange"/>
            </TransitionGroup>
            <div v-if="undoneTasks.length !== 0" class="w-[90%] flex flex-row justify-around items-center gap-[10px] my-[25px]">
              <span class="text-neutral font-light text-[13px] whitespace-nowrap">{{ $t('taskView.completed') }}</span>
              <div class="w-full border-t border-base-300/80"/>
            </div>
            <TransitionGroup name="task-card" tag="div" :class="`${undoneTasks.length === 0 && doneTasks.length !== 0? 'pt-[115px]':''} w-full flex flex-col justify-start items-center bg-base-100 gap-[15px]`">
              <task-card v-for="task in doneTasks" v-bind:key="task.id"
                         class="h-[62px] w-[95%] greyscale-90"
                         :task-entity="task" @on-complete-change="onCompletedChange"/>
            </TransitionGroup>
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
import {EventEnum} from "@/data/enum/EventEnum";
import * as DbUtils from "@/data/database/utils/database-utils";

const appStore = useAppStores();

const undoneTasks: Ref<TaskEntity[]> = ref([]);
const doneTasks: Ref<TaskEntity[]> = ref([]);

// 监听数据表变化
const dbStore = useDatabaseStores();

const updateTasks = (event?: any) => {
  DbUtils.getTaskEntityRepository()?.find({ relations: {
      tags: true,
      taskGroup: true,
    }}).then((result) => {
    undoneTasks.value = result.filter((task) => !task.isDone);
    doneTasks.value = result.filter((task) => task.isDone);
  });
}

dbStore.entityListeners.set(EventEnum.ALL, updateTasks);

function scrollInitialized() {
  for (const listener of appStore.mainScrollListeners.initialized) {
    listener();
  }
}

function onCompletedChange(isDone: boolean) {
  updateTasks();
}

onMounted(() => {
  updateTasks();
});

</script>


<style scoped lang="less">

</style>
