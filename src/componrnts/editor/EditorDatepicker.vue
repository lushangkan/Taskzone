<template>
   <div class="absolute left-0 top-[-35px] w-screen flex flex-row justify-center items-center">
     <vue-date-picker class="w-[320px] editor-datepicker" inline auto-apply :close-on-auto-apply="false"
                      :locale="useI18n().locale.value"
                      :six-weeks="true" v-bind="$attrs"
                      menu-class-name="datepicker-menu editor-datepicker-menu"
                      :transitions="{menuAppear: 'editor-datepicker' }"
     />
   </div>
</template>

<script setup lang="ts">
import {useI18n} from "vue-i18n";
import VueDatePicker from "@vuepic/vue-datepicker";

</script>

<style scoped lang="less">

</style>