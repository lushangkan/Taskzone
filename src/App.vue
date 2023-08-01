<template>
  <ion-app>
    <top-navbar>
      <ion-router-outlet class="z-0" id="main-content"/>
    </top-navbar>
  </ion-app>
</template>

<script setup lang="ts">
import {
  IonApp,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonRouterOutlet,
  IonSplitPane,
} from '@ionic/vue';
import {onMounted, ref} from 'vue';
import {
  archiveOutline,
  archiveSharp,
  bookmarkOutline,
  bookmarkSharp,
  heartOutline,
  heartSharp,
  mailOutline,
  mailSharp,
  paperPlaneOutline,
  paperPlaneSharp,
  trashOutline,
  trashSharp,
  warningOutline,
  warningSharp,
} from 'ionicons/icons';
import {generateThemeColorVariants} from "@/utils/theme-color-utils";
import TopNavbar from "@/componrnts/navbar/TopNavbar.vue";
import DayTaskView from "@/views/DayTaskView.vue";

onMounted(() => {
  // 生成主题色变体
  generateThemeColorVariants();
})

</script>

<style scoped lang="less">

</style>
