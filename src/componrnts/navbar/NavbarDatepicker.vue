<template>
  <div
      class="w-[310px] h-[359px] relative bg-base-100 rounded-b-[22px] shadow-[0_0_10px_0_rgba(0,0,0,0.08)] flex flex-col justify-center items-center">
    <vue-date-picker v-bind="$attrs" inline auto-apply :close-on-auto-apply="false"
                     :enable-time-picker="false" :locale="useI18n().locale.value"
                     v-model="date" :six-weeks="true" menu-class-name="datepicker-menu"
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

defineOptions({
  inheritAttrs: false
});

const date = ref('');

const emit = defineEmits(['on-date-change']);

watch(date, (newVal) => {
  const date = moment(newVal, 'YYYY/MM/DD HH:mm:ss');

  emit('on-date-change', date);
});

</script>

<style scoped lang="less">

</style>