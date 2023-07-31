<template>
  <ion-menu @ionWillClose="$emit('onmenuclose')" ref="menu" content-id="main-content" class="z-20 menu-panel">
    <div class="w-full h-full top-0 py-[29px] px-[30.5px] bg-base-100 flex-col justify-start items-center gap-[25px] flex">
      <div class="w-full flex-col justify-start items-center gap-[12px] inline-flex">
        <div class="w-full flex flex-row justify-start items-center px-[2px]">
          <button type="button" class="d-btn d-btn-circle d-btn-ghost w-[30px] h-[30px] min-h-[30px]">
            <SettingsIcon class="w-[24px] h-[24px]" color="hsl(var(--n--300))"/>
          </button>
        </div>
        <div class="box">
          <input type="text" placeholder="搜索任务"
                 class="d-input d-input-bordered border-[#C6C6C6] w-full h-[40px] rounded-[16px] px-[12px] z-[51] text-stone-300 text-[16.5px] font-light">
        </div>
      </div>
      <div class="w-full flex flex-col justify-start items-center gap-[20px]">
        <button
            class="d-btn d-btn-ghost btn-menu-active w-full h-[46px] min-h-[45px] rounded-[16px] flex flex-row justify-start items-center">
          <CalendarCheckIcon class="w-[21px] h-[21px]" color="hsl(var(--n-700))"></CalendarCheckIcon>
          <a class="text-[hsl(var(--n-700))] text-[18px] font-normal">日任务</a>
        </button>
        <button
            class="d-btn d-btn-ghost w-full h-[46px] min-h-[45px] rounded-[16px] flex flex-row justify-start items-center">
          <TagsIcon class="w-[21px] h-[21px]" color="hsl(var(--n-700))"></TagsIcon>
          <a class="text-[hsl(var(--n-700))] text-[18px] font-normal">标签</a>
        </button>
      </div>
      <div class="w-full flex flex-row justify-around items-center gap-[8px]">
        <a class="text-center text-[hsl(var(--n-700))] text-xs font-light">任务列表</a>
        <div class="w-[119px] h-[0px] border-t border-[hsl(var(--n-1000))]"/>
      </div>
      <!-- TODO 任务列表 -->
    </div>
  </ion-menu>
</template>

<script setup lang="ts">
import { IonMenu, IonContent } from "@ionic/vue";
import {onMounted, ref, useAttrs} from "vue";
import {
  MenuIcon,
  CalendarDaysIcon,
  SettingsIcon,
  CalendarCheckIcon,
  TagsIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next';

const menu = ref<IonMenu | null>(null);

console.log(useAttrs());
</script>

<style scoped lang="less">

</style>