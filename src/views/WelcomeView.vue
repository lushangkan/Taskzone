<template>
  <ion-page >
    <ion-content :fullscreen="true" :scroll-events=true>
      <div class="h-screen w-screen flex flex-col justify-center items-center gap-2.5 bg-base-100">
        <vue3-lottie :animationData="DottedLineFace" class="h-[90px] w-[90px]"/>
        <a class="text-center text-neutral text-sm font-thin" v-html="$t('page.welcome.tipsLine')"></a>
      </div>
    </ion-content>
    <add-task-btn/>
  </ion-page>
</template>

<script setup lang="ts">
import DottedLineFace from '@/assets/emoji/notoemoji/dotted-line-face.json'
import {Vue3Lottie} from "vue3-lottie";
import {IonContent, IonPage} from "@ionic/vue";
import AddTaskBtn from "@/componrnts/AddTaskBtn.vue";
</script>

<style scoped lang="less">

</style>