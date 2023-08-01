<template>
    <div class="w-[310px] h-[359px] relative bg-base-100 rounded-b-[22px] shadow-[0_0_10px_0_rgba(0,0,0,0.08)] flex flex-col justify-center items-center">
      <vue-tailwind-datepicker i18n="zh-cn" as-single no-input v-model="date" class="datepicker"/>
    </div>
</template>

<script setup lang="ts">
import {ref, watch, defineEmits} from "vue";
import VueTailwindDatepicker from "vue-tailwind-datepicker";
import moment from "moment";

const date = ref('');

const emit = defineEmits(['on-date-change']);

watch(date, (newVal) => {
  const date = moment(newVal, 'YYYY/MM/DD HH:mm:ss');

  emit('on-date-change', date);
});
</script>

<style scoped lang="less">

</style>