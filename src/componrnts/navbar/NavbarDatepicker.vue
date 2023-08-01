<template>
    <div class="w-[310px] h-[359px] relative bg-base-100 rounded-b-[22px] shadow-[0_0_10px_0_rgba(0,0,0,0.08)] flex flex-col justify-center items-center">
      <vue-tailwind-datepicker :i18n="useI18n().locale.value" as-single no-input v-model="date" class="datepicker"/>
    </div>
</template>

<script setup lang="ts">
import {ref, watch, defineEmits, onMounted} from "vue";
import VueTailwindDatepicker from "vue-tailwind-datepicker";
import moment from "moment";
import {useI18n} from "vue-i18n";

const date = ref('');

const emit = defineEmits(['on-date-change']);

watch(date, (newVal) => {
  const date = moment(newVal, 'YYYY/MM/DD HH:mm:ss');

  emit('on-date-change', date);
});

onMounted(() => {
  console.log(useI18n().locale)
})
</script>

<style scoped lang="less">

</style>