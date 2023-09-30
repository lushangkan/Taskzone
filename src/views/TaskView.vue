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
        <div id="main-scroll-content" class="w-full flex flex-col justify-start items-center pt-[115px] bg-base-100 gap-[15px]">
          <task-card v-for="task in tasks" v-bind:key="task.id" class="h-[62px]" :task-entity="task"/>
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

const tasks: Ref<TaskEntity[]> = ref([]);

// 监听数据表变化
const dbStore = useDatabaseStores();

function updateTasks(event?: any) {
  DbUtils.getTaskEntityRepository()?.find({ relations: {
      tags: true,
      taskGroup: true,
    }}).then((result) => {
    tasks.value = result;
  });
}

dbStore.entityListeners.set(EventEnum.ALL, updateTasks);

function scrollInitialized() {
  for (const listener of appStore.mainScrollListeners.initialized) {
    listener();
  }
}

onMounted(() => {
  updateTasks();
});

</script>


<style scoped lang="less">

</style>
