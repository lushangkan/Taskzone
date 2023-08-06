<template>
  <input type="text" v-model="input" v-bind="$attrs">
</template>

<script setup lang="ts">
import AutoComplete from "primevue/autocomplete";
import {ref} from "vue";

defineOptions({
  inheritAttrs: false
});

const input = ref('');

</script>

<style scoped lang="less">

</style>