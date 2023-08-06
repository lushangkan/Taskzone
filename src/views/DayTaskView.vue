<template>
  <ion-page class="bg-base-300">
    <ion-content :fullscreen="true" :scroll-events=true>
      <div class="w-full flex flex-col justify-start items-center pt-[150px] bg-base-100" @ionScroll="console.log($event)">
        <div class="bg-warning h-[150vh] w-3/4"></div>
      </div>
    </ion-content>
    <task-editor/>
    <add-task-btn/>
  </ion-page>
</template>

<script setup lang="ts">
import {IonContent, IonPage} from "@ionic/vue";
import AddTaskBtn from "@/componrnts/AddTaskBtn.vue";
import TaskEditor from "@/componrnts/editor/TaskEditor.vue";
</script>


<style scoped lang="less">

</style>