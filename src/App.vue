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
import {SettingEntity} from "@/data/database/entities/SettingEntity";
import {TagEntity} from "@/data/database/entities/TagEntity";
import {TaskEntity} from "@/data/database/entities/TaskEntity";
import {TaskGroupEntity} from "@/data/database/entities/TaskGroupEntity";

const appStore = useAppStores();

const dataBaseStore = useDatabaseStores();

onMounted(() => {
  // 生成主题色变体
  generateThemeColorVariants();

  // 检测是否支持Emoji v15
  checkIsSupportEmoji(appStore);

  console.log(dataBaseStore);

  console.log(FakeData);

  console.log(SettingEntity);
  console.log(TagEntity);
  console.log(TaskEntity);
  console.log(TaskGroupEntity);
});

</script>

<style scoped lang="less">

</style>
