<template>
  <!-- TODO: 缩小内容尺寸，使得在手机看起来没有这么大 -->
  <ion-menu @ionWillClose="$emit('onmenuclose')" ref="menu"
            content-id="main-content" class="z-20 menu-panel"
            :swipeGesture="!draggingCard"
  >
    <overlay-scrollbars-component defer element="div" :options="{
          overflow: {
            x: 'hidden',
          },
          scrollbars: {
            autoHide: 'leave',
            autoHideDelay: 200,
            clickScroll: true,
            theme: 'os-theme-dark',
          }
        }" class="w-full h-full">
      <div
          class="w-full overflow-y-auto top-0 py-[29px] px-[30.5px] bg-base-100 flex-col justify-start items-center gap-[25px] flex">
        <div class="w-full flex-col justify-start items-center gap-[12px] inline-flex">
          <div class="box">
            <input type="text" :placeholder="$t('menu.searchPapi')"
                   class="d-input d-input-bordered border-[#C6C6C6] w-full h-[40px] rounded-[16px] px-[12px] z-[51] text-stone-300 text-[16.5px] font-light">
          </div>
        </div>
        <div class="w-full flex flex-col justify-start items-center gap-[20px]">
          <div
              type="button" :title="$t('menu.dayTask')"
              class="d-btn d-btn-ghost btn-menu-active w-full h-[46px] min-h-[45px] rounded-[16px] flex flex-row justify-start items-center text-[hsl(var(--b1))] text-[18px] font-normal normal-case">
            <calendar-check-icon class="w-[21px] h-[21px]" color="hsl(var(--n-700))"/>
            {{ $t('menu.dayTask') }}
          </div>
          <div
              type="button" :title="$t('menu.tags')"
              class="d-btn d-btn-ghost w-full h-[46px] min-h-[45px] rounded-[16px] flex flex-row justify-start items-center text-[hsl(var(--n-700))] text-[18px] font-normal normal-case">
            <tags-icon class="w-[21px] h-[21px]" color="hsl(var(--n-700))"/>
            {{ $t('menu.tags') }}
          </div>
          <div
              type="button" :title="$t('menu.tags')"
              class="d-btn d-btn-ghost w-full h-[46px] min-h-[45px] rounded-[16px] flex flex-row justify-start items-center text-[hsl(var(--n-700))] text-[18px] font-normal normal-case">
            <settings-icon class="w-[21px] h-[21px]" color="hsl(var(--n-700))"/>
            {{ $t('menu.setting') }}
          </div>
        </div>
        <div class="w-full flex flex-row justify-around items-center gap-[8px]">
          <p class="text-center text-[hsl(var(--n-700))] text-xs font-light">{{ $t('menu.taskList') }}</p>
          <div class="w-[119px] h-[0px] border-t border-[hsl(var(--n-1000)) / 0.9]"/>
        </div>
        <Transition name="task-group-multi-select-menu">
          <div v-if="multiSelectMode" class="w-full h-[21px] flex flex-row justify-end items-center gap-[17px]">
            <button @click="onClickCloseMultiSelectMode" type="button" title="Close multi selection mode" class="d-btn d-btn-circle d-btn-ghost w-[21px] h-[21px] min-h-[21px]">
              <x-icon class="w-full h-full" color="hsl(var(--n))"/>
            </button>
            <button type="button" title="Delete selected task group" class="d-btn d-btn-circle d-btn-ghost w-[21px] h-[21px] min-h-[21px]">
              <trash2-icon class="w-full h-full" color="hsl(var(--n))"/>
            </button>
            <button type="button" title="Reset selected task group" class="d-btn d-btn-circle d-btn-ghost w-[21px] h-[21px] min-h-[21px]">
              <list-restart-icon class="w-full h-full" color="hsl(var(--n))"/>
            </button>
            <Transition name="multi-select-menu-edit-btn">
              <button v-if="appStore.selectedTaskGroups.length === 1" type="button" title="Edit selected task group" class="d-btn d-btn-circle d-btn-ghost w-[21px] h-[21px] min-h-[21px]">
                <pen-line-icon class="w-full h-full" color="hsl(var(--n))"/>
              </button>
            </Transition>
          </div>
        </Transition>
        <draggable v-model="taskGroups" item-key="id"
                   animation="200" tag="div"
                   :component-data="{ class: 'w-full flex flex-col justify-start items-center gap-[15px]' }"
                   @start="onDragStart" @end="onDragEnd"
                   delay="100" :disabled="multiSelectMode"
        >
          <template #item="{element}">
            <div class="list-group-item w-full">
              <task-group-card :task-group-entity="element"/>
            </div>
          </template>
        </draggable>
      </div>
    </overlay-scrollbars-component>
  </ion-menu>
</template>

<script setup lang="ts">
import {IonMenu} from "@ionic/vue";
import {CalendarCheckIcon, SettingsIcon, TagsIcon, XIcon, Trash2Icon, ListRestartIcon, PenLineIcon } from 'lucide-vue-next';
import TaskGroupCard from "@/componrnts/TaskGroupCard.vue";
import * as DBUtils from "@/data/database/utils/database-utils";
import {TaskGroupEntity} from "@/data/database/entities/TaskGroupEntity";
import {onMounted, Ref, ref} from "vue";
import {OverlayScrollbarsComponent} from "overlayscrollbars-vue";
import draggable from "zhyswan-vuedraggable";
import {useAppStores} from "@/stores/app-stores";
import EventType from "@/event/EventType";

const taskGroups: Ref<TaskGroupEntity[]> = ref([]);
const taskGroupRepository = DBUtils.getTaskGroupEntityRepository();

const multiSelectMode = ref(false);
const draggingCard = ref(false);

const appStore = useAppStores();

function onDragStart() {
  draggingCard.value = true;
  appStore.eventBus.emit(EventType.DRAGGING_TASK_GROUP_CARD_EVENT, {});
}

function onDragEnd() {
  draggingCard.value = false;
  appStore.eventBus.emit(EventType.DRAG_TASK_GROUP_CARD_END_EVENT, {});
}

function onClickCloseMultiSelectMode() {
  appStore.eventBus.emit(EventType.DISABLED_TASK_GROUP_CARD_MULTI_SELECTION_MODE_EVENT, {});
}

function onClickDeleteSelectedTaskGroup() {

}

function onClickResetSelectedTaskGroup() {

}

function onClickEditSelectedTaskGroup() {

}

const updateTaskGroups = async () => {
  taskGroups.value = (await taskGroupRepository?.find({
    relations: {
      tasks: true,
      tags: true
    }
  }))!.filter(groups => groups.dayTaskDate === null);
};

const enableMultiSelectModeCallBack = () => {
  multiSelectMode.value = true;
};

const disableMultiSelectModeCallBack = () => {
  multiSelectMode.value = false;
};

onMounted(() => {
  updateTaskGroups().then(() => {
    appStore.eventBus.on(EventType.DB_ALL, updateTaskGroups);
  });

  // 监听多选事件
  appStore.eventBus.on(EventType.ENABLED_TASK_GROUP_CARD_MULTI_SELECTION_MODE_EVENT, enableMultiSelectModeCallBack);
  appStore.eventBus.on(EventType.DISABLED_TASK_GROUP_CARD_MULTI_SELECTION_MODE_EVENT, disableMultiSelectModeCallBack);
})

</script>

<style scoped lang="less">

</style>
