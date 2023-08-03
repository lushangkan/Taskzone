<template>
  <Transition name="add-task-btn">
    <button v-show="appStore.addTaskBtnShow" type="button" title="add task"
            class="addtaskbtn d-btn d-btn-circle border-none fixed w-14 h-14 bottom-8 right-8 bg-primary shadow justify-center items-center inline-flex z-30">
      <PlusIcon color="hsl(var(--b1))"
                class="w-[39px] h-[39px] relative flex-col justify-start items-start flex"></PlusIcon>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import {PlusIcon} from 'lucide-vue-next'
import {onMounted, reactive, Ref, ref} from "vue";
import {useAppStores} from "@/stores/app-stores";

const scrollEle = ref<HTMLElement | undefined>();

const appStore = useAppStores();

onMounted(() => {
  // 获取滚动元素
  const content: HTMLIonContentElement = (document.getElementsByTagName('ion-content')[0] as HTMLIonContentElement);
  content.getScrollElement().then((ele) => {
    scrollEle.value = ele;
  });
});

</script>

<style scoped lang="less">

</style>