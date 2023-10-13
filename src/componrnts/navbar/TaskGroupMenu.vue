<template>
  <ul class="absolute w-[112px] right-0 mt-[20px] gap-[3px] navbar-multiple-selection-menu d-dropdown-content d-menu bg-base-100 rounded-box">
    <li @click="onClickEditBtn">
      <div class="flex flex-row justify-around items-center">
        <pen-line class="stroke-inherit w-[19px] h-[19px]"/>
        <span class="text-inherit text-sm font-medium">编辑</span>
      </div>
    </li>
    <li @click="onClickDelBtn">
      <div class="flex flex-row justify-around items-center">
        <trash2-icon class="stroke-inherit w-[19px] h-[19px]"/>
        <span class="text-inherit text-sm font-medium">删除</span>
      </div>
    </li>
    <li @click="onClickResetBtn">
      <div class="flex flex-row justify-around items-center">
        <list-restart-icon class="stroke-inherit w-[19px] h-[19px]"/>
        <span class="text-inherit text-sm font-medium">重置</span>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import {PenLine, Trash2Icon, ListRestartIcon} from "lucide-vue-next";
import * as dbUtils from "@/data/database/utils/database-utils";
import {TaskGroupEntity} from "@/data/database/entities/TaskGroupEntity";
import {useDatabaseStores} from "@/stores/database-stores";

const emit = defineEmits<{
  (e: 'clickEditBtn'): void
  (e: 'clickDelBtn'): void
  (e: 'clickResetBtn'): void
}>();

const props = defineProps({
  taskGroupEntity: {
    type: TaskGroupEntity,
    required: true
  }
});

const dbStore = useDatabaseStores();

function onClickEditBtn() {
  emit("clickEditBtn");
}

function onClickDelBtn() {
  emit("clickDelBtn");

  dbStore.entityManager?.remove(props.taskGroupEntity!);
}

function onClickResetBtn() {
  emit("clickResetBtn");
}
</script>

<style scoped lang="less">

</style>
