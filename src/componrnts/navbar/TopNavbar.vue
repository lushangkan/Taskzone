<template>
  <sticky-element :scrollElement="scrollEle" stuckClass="navbar-stuck" showClass="navbar-show" transitionClass="navbar-transition" id="sticky-navbar" @stuck="appStore.addTaskBtnShow=!$event">
    <div id="app-navbar" class="fixed flex flex-col justify-start items-center w-full py-[16px] z-10">
      <ion-header
          class="d-navbar border-none flex flex-row justify-around items-center w-[348px] h-[63px] px-[13px] rounded-3xl navbar-shadow bg-gradient-to-br from-[hsl(var(--p--100))] to-[hsl(var(--p-300))]">
        <div class="navbar-start">
          <button type="button" title="Open menu" :class="`d-btn d-btn-ghost ${menuOpen?'d-btn-active':''}`"
                  @click="menuOpen=!menuOpen">
            <menu-icon class="w-[24px] h-[24px]" color="hsl(var(--b1))"/>
          </button>
        </div>
        <div class="d-navbar-start">
          <ion-title class="text-base-100 text-lg font-medium">{{
              pageName === 'daytask' ? titleDate === 'today' ? i18n.t('page.daytask.today') : titleDate : i18n.t(`page.${pageName}.name`, i18n.t('page.pageNotFound'))
            }}
          </ion-title>
        </div>
        <div class="navbar-end">
          <button v-if="pageName==='daytask'" type="button" title="Open datepicker"
                  :class="`d-btn d-btn-ghost ${datepickerOpen?'d-btn-active':''}`"
                  @click="datepickerOpen=!datepickerOpen">
            <calendar-days-icon class="w-[24px] h-[24px]" color="hsl(var(--b1))"/>
          </button>
        </div>
      </ion-header>
      <Transition name="datepicker">
        <navbar-datepicker v-if="datepickerOpen" @on-date-change="onDateChange"/>
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
import StickyElement from 'vue-sticky-element';
import {useAppStores} from "@/stores/app-stores";
import anime from 'animejs/lib/anime.es.js';
import {useI18n} from "vue-i18n";
import moment from "moment";
import {Moment} from "moment";
import "moment/dist/locale/zh-cn.js";

const i18n = useI18n();

const router = useRouter();

const pageName = ref(router.currentRoute.value.name);

const titleDate = ref('');

const menuOpen = ref(false);

const datepickerOpen = ref(false);

const scrollEle = ref<HTMLElement | undefined | null>();

const appStore = useAppStores();

moment.locale(i18n.locale.value);

// 当菜单打开状态改变
watch(menuOpen, (newVal) => {
  if (newVal) {
    menuController.open();
  } else {
    menuController.close();
  }
});

// 当Datepicker打开状态改变
watch(datepickerOpen, (newVal) => {
  if (newVal) {
    // 打开
    anime({
      targets: '#app-navbar',
      keyframes: [
        {
          translateY: '8%',
          duration: 280
        },
        {
          translateY: '0',
          duration: 280
        }
      ],
    });
  } else {
    // 关闭
    anime({
      targets: '#app-navbar',
      keyframes: [
        {
          translateY: '-10%',
          duration: 230
        },
        {
          translateY: '0',
          duration: 200
        }
      ]
    });
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
  appStore.mainScrollListeners.initialized.push(() => {
    const scrollContent = document.getElementById('main-scroll-content');
    if (scrollContent !== null) {
      scrollEle.value = scrollContent.parentElement;
    } else {
      scrollEle.value = undefined;
      console.warn('Could not find scroll element');
    }
  })

})

</script>

<style scoped lang="less">

</style>
