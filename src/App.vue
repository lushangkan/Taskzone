<template>
  <ion-app class="select-none">
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
import {checkIsSupportEmoji} from "@/utils/fun";
import {useAppStores} from "@/stores/app-stores";

const appStore = useAppStores();

onMounted(() => {
  // 生成主题色变体
  generateThemeColorVariants();

  // 检测是否支持Emoji v15
  checkIsSupportEmoji(appStore);
})

</script>

<style scoped lang="less">

</style>
