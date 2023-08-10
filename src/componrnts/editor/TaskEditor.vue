<template>
  <div class="fixed top-0 w-full h-full bg-black bg-opacity-10 flex flex-col justify-end items-center z-30">
    <div class="draggable-parent absolute h-[564px] w-full">
      <div ref="editorRef" v-drag="{ axis: 'y', handle: '.guide-strip', snap: snap, animationCSS: 'editor-animation', useDefaultPosition: true }"
           @click="onClickEditor($event)" :class="`${detailMode?'bottom-0':'top-[308px]'} absolute w-full rounded-t-[40px] bg-base-100 editor`"
           @v-drag-snapping="onDragSnapping"
      >
        <div ref="editorContentRef" id="editor-content" :class="`${detailMode?'editor-detail':''} flex flex-col justify-around items-center py-[21px] gap-[20px]`">
          <div class="top flex w-full flex-col justify-around items-center gap-[20px]">
            <div class="guide-strip w-full h-[20px] flex flex-row justify-center items-center">
              <div class="w-[50px] rounded-full border-base-300 border-[3px]"/>
            </div>
            <a class="text-stone-500 text-base font-light">新建任务</a>
          </div>

          <div class="line1 flex flexvue-row justify-around items-center gap-[15px]">
            <div class="icon-color">
              <button id="color-emoji-btn" type="button" title="selecting colors and icons" class="d-btn d-btn-circle h-[55px] w-[55px] bg-warning border-base-300 border-[4px] border-solid flex flex-row justify-center items-center">
                <Icon icon="noto:cookie" class="h-[35px] w-[35px]"/>
              </button>
            </div>
            <div class="d-form-control">
              <label v-if="detailMode" class="label pb-[3px] pl-[7px] flex flex-row justify-start items-center gap-[6px]">
                <PenLine class="w-[15px] h-[15px] left-[13px] text-base-300" stroke-width="2.5px"/>
                <a class="d-label-text text-neutral-content font-normal text-[13px]">任务名称</a>
              </label>
              <div class="input-group relative h-[50px] w-[193px]">
                <input type="text" :placeholder="detailMode?'':'任务名称'" class="d-input d-input-bordered w-full h-full max-w-xs rounded-[18px] pl-[40px]">
                <PenLine v-if="!detailMode" class="vertical-centering w-[20px] h-[20px] left-[13px] text-base-300"/>
              </div>
            </div>
          </div>
          <div v-if="detailMode" class="line2 w-[267px] flex flex-row justify-between items-center">
            <div class="tag-picker d-form-control w-[47%]">
              <label class="d-label pb-[3px] pl-[7px] flex flex-row justify-start items-center gap-[6px]">
                <TagIcon class="w-[15px] h-[15px] left-[13px] text-base-300" stroke-width="2.5px"/>
                <a class="label-text text-neutral-content font-normal text-[13px]">任务标签</a>
              </label>
              <tag-picker class="d-input d-input-bordered w-full h-[45px] max-w-xs rounded-[18px]"/>
            </div>
            <div class="date-picker d-form-control w-[47%]">
              <label class="d-label pb-[3px] pl-[7px] flex flex-row justify-start items-center gap-[6px]">
                <CalendarCheckIcon class="w-[15px] h-[15px] left-[13px] text-base-300" stroke-width="2.5px"/>
                <a class="label-text text-neutral-content font-normal text-[13px]">完成期限</a>
              </label>
              <editor-datepicker v-if="datepickerOpen" v-model="dateValue"/>
              <input ref="ddlInputRef" type="text" @click="datepickerOpen=!datepickerOpen" v-model="displayDate" readonly="readonly" placeholder="选择日期" class="ddl-input d-input d-input-bordered w-full h-[45px] max-w-xs rounded-[18px] text-[13px] font-light placeholder:text-base-300"/>
            </div>
          </div>
        </div>
        <div class="flex flex-row justify-end items-center w-full px-[65px] pb-[20px]">
          <button type="button" title="continue" class="d-btn d-btn-circle h-[55px] w-[55px] bg-primary flex flex-row justify-center items-center">
            <check class="text-base-100 h-[28px] w-[28px]"></check>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Icon} from "@iconify/vue";
import {PenLine, X, Check, TagIcon, CalendarCheckIcon} from "lucide-vue-next";
import {onMounted, type Ref, ref, watch} from "vue";
import TagPicker from "@/componrnts/TagPicker.vue";
import EditorDatepicker from "@/componrnts/editor/EditorDatepicker.vue";
import moment from "moment";
import anime from "animejs/lib/anime.es.js";

const detailMode = ref(false);

const datepickerOpen = ref(false);
const dateValue = ref('');
const displayDate = ref('');
const ddlInputRef = ref<HTMLInputElement>();

const editorRef = ref<HTMLInputElement | null>(null)
const editorContentRef = ref<HTMLDivElement | null>(null)

const snap = ref(Math.round(window.screen.height * 0.365));

watch(dateValue, (dateStr: string) => {
  const date = moment(dateStr);
  if (date.isSame(moment(), 'day')) {
    displayDate.value = date.format('HH:mm');
    return;
  } else if (date.isSame(moment(), 'year')) {
    displayDate.value = date.format('MM/DD HH:mm');
    return;
  }
  displayDate.value = date.format('YYYY/MM/DD HH:mm');
})

function onClickEditor(event: PointerEvent) {
  if (datepickerOpen.value) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (event.target instanceof Element && !event.target.isEqualNode(ddlInputRef.value!)) {
      datepickerOpen.value = false;
    }
  }
}

// 当编辑器被拖动
function onDragSnapping() {
  requestAnimationFrame(() => {
    if (editorRef.value?.style.transform !== '' && editorRef.value?.style.transform !== 'none' && editorRef.value?.style.transform.indexOf('matrix') !== -1) {
      // 存在transform
      const transform = editorRef.value?.style.transform;
      const y = transform.match(/matrix\((-?\d+(?:\.\d+)?), (-?\d+(?:\.\d+)?), (-?\d+(?:\.\d+)?), (-?\d+(?:\.\d+)?), (-?\d+(?:\.\d+)?), (-?\d+(?:\.\d+)?)\)/)?.[6];

      if (y > -5 && y < snap.value - 30) {
        detailMode.value = true;
      } else if (y > snap.value - 50) {
        detailMode.value = false;
      }
    }
  });
};

onMounted(() => {

})

</script>

<style scoped lang="less">

</style>
