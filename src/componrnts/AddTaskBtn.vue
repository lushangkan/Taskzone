<template>
  <div class="fixed bottom-8 right-8 flex flex-col justify-end items-end gap-[20px] z-20">
    <Transition name="options-btn">
      <div v-if="optionsBtnShow" class="w-[140px] flex flex-col gap-[20px] items-end justify-center">
        <button type="button" title="add task list" class="d-btn bg-base-100 w-[140px] h-[52px] border-neutral border rounded-full flex flex-row justify-start items-center gap-[10px] text-stone-500 text-sm font-light shadow-[0_0_10px_0_rgba(0,0,0,0.08)]">
          <list-checks-icon class="w-[24px] h-[24px]" color="hsl(var(--n))" stroke-width="1.6px"></list-checks-icon>
          {{ $t('addTaskBtn.addTaskList') }}
        </button>
        <button type="button" title="add task" class="d-btn bg-base-100 w-[140px] h-[52px] border-neutral border rounded-full flex flex-row justify-start items-center gap-[10px] text-stone-500 text-sm font-light shadow-[0_0_10px_0_rgba(0,0,0,0.08)]">
          <check-circle-icon class="w-[24px] h-[24px]" color="hsl(var(--n))" stroke-width="1.6px"></check-circle-icon>
          {{ $t('addTaskBtn.addTask') }}
        </button>
      </div>
    </Transition>
    <Transition name="add-task-btn">
      <button v-show="addTaskBtnShow" type="button" title="add task" @click="optionsBtnShow=!optionsBtnShow"
              class="addtaskbtn d-btn d-btn-circle border-none w-14 h-14 bg-primary shadow justify-center items-center inline-flex z-30">
        <PlusIcon color="hsl(var(--b1))"
                  class="w-[39px] h-[39px] relative flex-col justify-start items-start flex"></PlusIcon>
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import {PlusIcon, ListChecksIcon, CheckCircleIcon} from 'lucide-vue-next'
import {onMounted, reactive, Ref, ref} from "vue";
import {useAppStores} from "@/stores/app-stores";

const scrollEle = ref<HTMLElement | undefined>();

const optionsBtnShow = ref(false);

const addTaskBtnShow = ref(true);

const appStore = useAppStores();

onMounted(() => {
  // 获取滚动元素
  const content: HTMLIonContentElement = (document.getElementsByTagName('ion-content')[0] as HTMLIonContentElement);
  content.getScrollElement().then((ele) => {
    // 监听滚动事件
    let lastScrollTop = 0;

    ele.addEventListener('scroll', () => {
      const scrollTop = ele.scrollTop;
      if (scrollTop > lastScrollTop && scrollTop - lastScrollTop > 20) {
        addTaskBtnShow.value = false;
      } else if (scrollTop < lastScrollTop && lastScrollTop - scrollTop > 20) {
        addTaskBtnShow.value = true;
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
  });

  // 监听content Click事件
  content.addEventListener('click', () => {
    optionsBtnShow.value = false;
  });
});

</script>

<style scoped lang="less">

</style>