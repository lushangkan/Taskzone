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
import {useDatabaseStores} from "@/stores/database-stores";
import * as FakeData from "@/data/database/utils/gen-fake-data";

const appStore = useAppStores();

const dataBaseStore = useDatabaseStores();

onMounted(() => {
  // 生成主题色变体
  generateThemeColorVariants();

  // 检测是否支持Emoji v15
  checkIsSupportEmoji(appStore);

  console.log(dataBaseStore);

  console.log(FakeData)
});

</script>

<style scoped lang="less">

</style>
