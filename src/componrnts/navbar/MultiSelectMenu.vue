<template>
  <ul ref="multiSelectMenu" class="absolute w-[112px] right-0 mt-[20px] gap-[3px] navbar-multiple-selection-menu d-dropdown-content d-menu bg-base-100 rounded-box">
    <li v-if="appStore.selectedTasks.length === 1" @click="onClickEditBtn">
      <div class="flex flex-row justify-around items-center">
        <pen-line class="stroke-inherit w-[19px] h-[19px]"/>
        <span class="text-inherit text-sm font-medium">编辑</span>
      </div>
    </li>
    <li @click="onClickCopyBtn">
      <div class="flex flex-row justify-around items-center">
        <clipboard-paste class="stroke-inherit w-[19px] h-[19px]"/>
        <span class="text-inherit text-sm font-medium">复制</span>
      </div>
    </li>
    <li @click="onClickMoveBtn">
      <div class="flex flex-row justify-around items-center">
        <folder-output class="stroke-inherit w-[19px] h-[19px]"/>
        <span class="text-inherit text-sm font-medium">移动</span>
      </div>
    </li>
  </ul>
</template>
<script setup lang="ts">
import {ClipboardPaste, FolderOutput, PenLine} from "lucide-vue-next";
import {useAppStores} from "@/stores/app-stores";
import EventType from "@/event/EventType";

const emit = defineEmits<{
  (e: 'clickEditBtn'): void
  (e: 'clickCopyBtn'): void
  (e: 'clickMoveBtn'): void
}>();

function onClickEditBtn() {
  emit('clickEditBtn')
  appStore.eventBus.emit(EventType.CLICK_EDIT_TASK_BUTTON_EVENT, {});
}

function onClickMoveBtn() {
  emit('clickCopyBtn');
  appStore.eventBus.emit(EventType.CLICK_MOVE_TASK_BUTTON_EVENT, {});
}

function onClickCopyBtn() {
  emit('clickMoveBtn')
  appStore.eventBus.emit(EventType.CLICK_COPY_TASK_BUTTON_EVENT, {});
}

const appStore = useAppStores();

</script>
<style scoped lang="less">

</style>
