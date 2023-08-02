<template>
  <ion-app>
    <top-navbar>
      <ion-router-outlet class="z-0" id="main-content"/>
    </top-navbar>
  </ion-app>
</template>

<script setup lang="ts">
import {IonApp, IonRouterOutlet,} from '@ionic/vue';
import {onMounted} from 'vue';
import {generateThemeColorVariants} from "@/utils/theme-color-utils";
import TopNavbar from "@/componrnts/navbar/TopNavbar.vue";

onMounted(() => {
  // 生成主题色变体
  generateThemeColorVariants();
})

</script>

<style scoped lang="less">

</style>
