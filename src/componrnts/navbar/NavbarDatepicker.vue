<template>
  <div
      class="w-[310px] h-[360px] py-[20px] relative bg-base-100 rounded-b-[22px] shadow-[0_0_10px_0_rgba(0,0,0,0.08)] flex flex-col justify-start items-center overflow-hidden">
    <vue-date-picker inline auto-apply :close-on-auto-apply="false"
                     :enable-time-picker="false" :locale="useI18n().locale.value"
                     v-bind="$attrs" :six-weeks="true" menu-class-name="datepicker-menu"
                     :transitions="{ open:'navbar-datepicker', close: 'navbar-datepicker', menuAppear: 'navbar-datepicker' }"

    />
  </div>
</template>

<script setup lang="ts">
import {defineEmits, ref, watch} from "vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import moment from "moment";
import {useI18n} from "vue-i18n";
import "moment/dist/locale/zh-cn.js";

defineOptions({
  inheritAttrs: false
})

</script>

<style scoped lang="less">

</style>
