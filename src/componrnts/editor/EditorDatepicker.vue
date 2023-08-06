<template>
  <div class="absolute left-0 top-[-35px] w-screen flex flex-row justify-center items-center">
    <vue-date-picker class="w-[320px] editor-datepicker drop-shadow-[0_0_10px_hsla(var(--n)/0.15)]" inline auto-apply :close-on-auto-apply="false"
                     :locale="useI18n().locale.value"
                     :six-weeks="true" v-bind="$attrs"
                     menu-class-name="datepicker-menu editor-datepicker-menu"
                     :on-click-outside="$emit('on-click-outside')"
    />
  </div>
</template>

<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {defineEmits, ref, watch} from "vue";
import moment from "moment/moment";
import VueDatePicker from "@vuepic/vue-datepicker";

</script>

<style scoped lang="less">

</style>