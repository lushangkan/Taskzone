<template>
  <ion-app class="select-none">
    <top-navbar>
      <router-view class="z-0" id="main-content"/>
    </top-navbar>
  </ion-app>
</template>

<script setup lang="ts">
import {IonApp, IonRouterOutlet,} from '@ionic/vue';
import {onMounted, onUnmounted} from 'vue';
import {generateThemeColorVariants} from "@/utils/theme-color-utils";
import TopNavbar from "@/componrnts/navbar/TopNavbar.vue";
import {checkIsSupportEmoji} from "@/utils/fun";
import {useAppStores} from "@/stores/app-stores";
import {useDatabaseStores} from "@/stores/database-stores";
import * as FakeData from "@/data/database/utils/gen-fake-data";
import * as DbUtil from "@/data/database/utils/database-utils";
import {SettingEntity} from "@/data/database/entities/SettingEntity";
import {TagEntity} from "@/data/database/entities/TagEntity";
import {TaskEntity} from "@/data/database/entities/TaskEntity";
import {TaskGroupEntity} from "@/data/database/entities/TaskGroupEntity";
import moment from "moment";
import Color from "colorjs.io";
import {checkTodayTaskGroup} from "@/data/database/utils/database-utils";

const appStore = useAppStores();

const dbStore = useDatabaseStores();

onMounted(() => {
  // 生成主题色变体
  generateThemeColorVariants();

  // 检测是否支持Emoji v15
  checkIsSupportEmoji(appStore);

  // 检测是否已经创建今日任务组
  checkTodayTaskGroup();

  console.log(dbStore);

  console.log(FakeData);

  console.log(DbUtil);
});

onUnmounted(() => {
  // 关闭数据库连接
  DbUtil.closeDatabase();
});
</script>

<style scoped lang="less">

</style>
