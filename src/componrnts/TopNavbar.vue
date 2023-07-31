<template>
    <div class="fixed flex flex-col justify-start items-center w-full h-full py-[16px] z-10">
      <side-panel @onmenuclose="menuOpen=false"/>
      <ion-header
          class="d-navbar border-none flex flex-row justify-around items-center w-[348px] h-[63px] px-[13px] rounded-3xl shadow-[0_4px_4px_0_rgba(0,0,0,0.08)] bg-gradient-to-br from-[hsl(var(--p--100))] to-[hsl(var(--p-300))]">
        <div class="navbar-start">
          <button type="button" title="Open menu" :class="`d-btn d-btn-ghost ${menuOpen?'d-btn-active':''}`" @click="menuOpen=!menuOpen">
            <menu-icon class="w-[24px] h-[24px]" color="hsl(var(--b1))"/>
          </button>
        </div>
        <div class="d-navbar-start">
          <ion-title class="text-base-100 text-lg font-medium">{{
              pageName === 'daytask' ? titleDate === 'today' ? $t('page.daytask.today') : titleDate : $t(`page.${pageName}.name`)
            }}</ion-title>
        </div>
        <div class="navbar-end">
          <button type="button" title="Open datepicker" class="d-btn d-btn-ghost">
            <calendar-days-icon class="w-[24px] h-[24px]" color="hsl(var(--b1))"/>
          </button>
        </div>
      </ion-header>
    </div>
    <slot/>
</template>

<script setup lang="ts">
import {
  MenuIcon,
  CalendarDaysIcon,
  SettingsIcon,
  CalendarCheckIcon,
  TagsIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next';
import {onMounted, ref, watch} from "vue";
import {useRouter} from "vue-router";
import SidePanel from "@/componrnts/SidePanel.vue";
import {menuController} from "@ionic/vue";

const router = useRouter();

const pageName = ref(router.currentRoute.value.name);

const titleDate = ref('');

const menuOpen = ref(false);

watch(menuOpen, (newVal) => {
  if (newVal) {
    menuController.open();
  } else {
    menuController.close();
  }
});

onMounted(() => {
  // 获取日任务路由参数的日期
  if (router.currentRoute.value.params.date) {
    // 存在日期参数
    // 日期格式校验
    const dateStr = router.currentRoute.value.params.date;
    const date = moment(dateStr, 'YYYY-MM-DD');
    if (date.isValid()) {
      // 日期有效
      if (date.isSame(moment(), 'day')) {
        titleDate.value = 'today';
      } else if (!date.isSame(moment(), 'year')) {
        titleDate.value = date.format('LL');
      } else {
        titleDate.value = date.format('MMMDo');
      }
    } else {
      titleDate.value = 'today';
    }
  } else {
    titleDate.value = 'today';
  }
})

</script>

<style scoped lang="less">

</style>