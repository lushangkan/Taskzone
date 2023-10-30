<template>
  <div ref="parentRef">
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
    <Transition appear name="popup">
      <confirm-deletion-popup ref="popup" v-if="popupOpen" prompt="确定要删除此任务组吗" @click-cancel-btn="popupOpen = false" @click-delete-btn="onClickPopupDelete"/>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import {ListRestartIcon, PenLine, Trash2Icon} from "lucide-vue-next";
import {TaskGroupEntity} from "@/data/database/entities/TaskGroupEntity";
import {useDatabaseStores} from "@/stores/database-stores";
import ConfirmDeletionPopup from "@/componrnts/popup/ConfirmDeletionPopup.vue";
import {onMounted, onUnmounted, ref} from "vue";

const emit = defineEmits<{
  (e: 'clickEditBtn'): void
  (e: 'clickDelBtn'): void
  (e: 'clickResetBtn'): void
  (e: 'clickOutSide'): void
}>();

const props = defineProps({
  taskGroupEntity: {
    type: TaskGroupEntity,
    required: true
  }
});

const dbStore = useDatabaseStores();

const popupOpen = ref(false);

const parentRef = ref<HTMLDivElement | null>(null);

function onClickEditBtn() {
  emit("clickEditBtn");
}

function onClickDelBtn() {
  popupOpen.value = true;
}

function onClickResetBtn() {
  emit("clickResetBtn");
}

function onClickPopupDelete() {
  if (props.taskGroupEntity === undefined) return;

  dbStore.entityManager?.remove(props.taskGroupEntity);

  popupOpen.value = false;

  emit("clickDelBtn");
}

const onClickWindow = (event: UIEvent) => {
  if (parentRef.value === null) return;

  const button = parentRef.value?.parentElement!.getElementsByTagName('button')[0];

  if (event.target instanceof Node && !parentRef.value?.contains(event.target) && !event.target.isEqualNode(parentRef.value) && !event.target.isEqualNode(button) && !button.contains(event.target)) {
    emit('clickOutSide');
  }
}

onMounted(() => {
  window.addEventListener('click', onClickWindow);
});

onUnmounted(() => {
  window.removeEventListener('click', onClickWindow);
});

</script>

<style scoped lang="less">

</style>
