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
        <div id="main-scroll-content" class="w-full flex flex-col justify-start items-center pt-[115px] bg-base-100">
          <task-card class="h-[62px]"/>
        </div>
      </overlay-scrollbars-component>
    </ion-content>
    <add-task-btn/>
  </ion-page>
</template>

<script setup lang="ts">
import {IonContent, IonPage} from "@ionic/vue";
import AddTaskBtn from "@/componrnts/AddTaskBtn.vue";
import { OverlayScrollbarsComponent } from "overlayscrollbars-vue";
import {useAppStores} from "@/stores/app-stores";
import TaskCard from "@/componrnts/TaskCard.vue";

const appStore = useAppStores();

function scrollInitialized() {
  for (const listener of appStore.mainScrollListeners.initialized) {
    listener();
  }
}


</script>


<style scoped lang="less">

</style>
