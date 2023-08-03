<template>
  <Transition name="add-task-btn">
    <button v-show="btnShow" type="button" title="add task"
            class="addtaskbtn d-btn d-btn-circle border-none fixed w-14 h-14 bottom-8 right-8 bg-primary shadow justify-center items-center inline-flex z-30">
      <PlusIcon color="hsl(var(--b1))"
                class="w-[39px] h-[39px] relative flex-col justify-start items-start flex"></PlusIcon>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import {PlusIcon} from 'lucide-vue-next'
import StickyElement from 'vue-sticky-element';
import {onMounted, Ref, ref} from "vue";

const btnShow: Ref<boolean> = ref(true);

onMounted(() => {
  document.getElementById('sticky-navbar')?.addEventListener('stuck', (e) => {
    btnShow.value = true;
  });
  document.getElementById('sticky-navbar')?.addEventListener('show', (e) => {
    btnShow.value = false;
  });
});

</script>

<style scoped lang="less">

</style>