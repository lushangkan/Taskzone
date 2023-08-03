<template>
  <sticky-element :scrollElement="scrollEle" stuckClass="navbar-stuck" showClass="navbar-show" transitionClass="navbar-transition" id="sticky-navbar" @stuck="appStore.addTaskBtnShow=!$event">
    <div class="fixed flex flex-col justify-start items-center w-full py-[16px] z-10">
      <ion-header
          class="d-navbar border-none flex flex-row justify-around items-center w-[348px] h-[63px] px-[13px] rounded-3xl shadow-[0_4px_4px_0_rgba(0,0,0,0.08)] bg-gradient-to-br from-[hsl(var(--p--100))] to-[hsl(var(--p-300))]">
        <div class="navbar-start">
          <button type="button" title="Open menu" :class="`d-btn d-btn-ghost ${menuOpen?'d-btn-active':''}`"
                  @click="menuOpen=!menuOpen">
            <menu-icon class="w-[24px] h-[24px]" color="hsl(var(--b1))"/>
          </button>
        </div>
        <div class="d-navbar-start">
          <ion-title class="text-base-100 text-lg font-medium">{{
              pageName === 'daytask' ? titleDate === 'today' ? $t('page.daytask.today') : titleDate : $t(`page.${pageName}.name`)
            }}
          </ion-title>
        </div>
        <div class="navbar-end">
          <button type="button" title="Open datepicker"
                  :class="`d-btn d-btn-ghost ${datepickerOpen?'d-btn-active':''}`"
                  @click="datepickerOpen=!datepickerOpen">
            <calendar-days-icon class="w-[24px] h-[24px]" color="hsl(var(--b1))"/>
          </button>
        </div>
      </ion-header>
      <Transition name="datepicker">
        <navbar-datepicker v-show="datepickerOpen" @ondatechange="onDateChange"/>
      </Transition>
    </div>
  </sticky-element>
  <side-panel @onmenuclose="menuOpen=false" class="w-full h-full z-20"/>
  <slot/>
</template>

<script setup lang="ts">
import {IonHeader, IonTitle, menuController} from "@ionic/vue";
import {CalendarDaysIcon, MenuIcon} from 'lucide-vue-next';
import {onMounted, onUnmounted, type Ref, ref, watch} from "vue";
import {useRouter} from "vue-router";
import SidePanel from "@/componrnts/navbar/SidePanel.vue";
import NavbarDatepicker from "@/componrnts/navbar/NavbarDatepicker.vue";
import {Moment} from "moment";
import StickyElement from 'vue-sticky-element';
import {useAppStores} from "@/stores/app-stores";

const router = useRouter();

const pageName = ref(router.currentRoute.value.name);

const titleDate = ref('');

const menuOpen = ref(false);

const datepickerOpen = ref(false);

const scrollEle = ref<HTMLElement>();

const appStore = useAppStores();

// 当菜单打开状态改变
watch(menuOpen, (newVal) => {
  if (newVal) {
    menuController.open();
  } else {
    menuController.close();
  }
});

// 当Datepicker值发生变化
function onDateChange(date: Moment) {
  if (date.isSame(moment(), 'day')) {
    titleDate.value = 'today';
  } else if (!date.isSame(moment(), 'year')) {
    titleDate.value = date.format('LL');
  } else {
    titleDate.value = date.format('MMMDo');
  }
}

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

  // 获取滚动元素
  const content: HTMLIonContentElement = (document.getElementsByTagName('ion-content')[0] as HTMLIonContentElement);
  content.getScrollElement().then((ele) => {
    scrollEle.value = ele;
  });
})

</script>

<style scoped lang="less">

</style>