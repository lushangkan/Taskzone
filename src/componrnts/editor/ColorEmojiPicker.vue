<template>
  <div class="flex flex-col justify-center items-center py-[29px] px-[30px]">
    <div class="flex flex-row justify-start items-center w-full pb-[10px] px-[4px]">
      <button type="button" title="close" class="d-btn d-btn-circle d-btn-ghost h-[32px] w-[32px] min-h-0" @click="$emit('on-back-click')">
        <chevron-left-icon class="h-[30px] w-[30px] text-neutral" stroke-width="1.6"/>
      </button>
    </div>
    <div class="d-tabs flex flex-row justify-start items-center w-full h-[32px] gap-[0] px-[9px]">
      <a @click="clickEmoji" :class="`${emojiOpen?'d-tab-active':''} d-tab d-tab-bordered tab-bordered-transition text-[14.5px]`">图标</a>
      <a @click="clickColor" :class="`${colorOpen?'d-tab-active':''} d-tab d-tab-bordered tab-bordered-transition text-[14.5px]`">颜色</a>
      <div class="relative border-transparent border-b-base-content/20 border-[3px] h-full w-[190px] left-[-1px]"/>
    </div>
    <div v-if="emojiOpen" class="flex flex-col justify-center items-center w-full">
      <div class="flex flex-row justify-center items-center py-[40px]">
        <div class="h-[70px] w-[70px] rounded-full border-primary border-[4px] flex flex-row justify-center items-center">
          <a class="text-[32px]">{{ emojiValue }}</a>
        </div>
      </div>
      <emoji-picker :native="true" :group-names="$tm('emojiPicker.groupNames')"
                   @select="onSelectEmoji"
                   :static-texts="$tm('emojiPicker.staticText')" :display-recent="true"
                   :emoji-list="emojis" :hide-selected-emoji="true"
                   search-class="!d-input !d-input-bordered !h-[28px] !text-[13px]"
                   class="emoji-picker shadow-none w-full h-[365px]"
      />
    </div>
    <div v-if="colorOpen" class="flex flex-row justify-center items-center w-full">
      <color-picker is-widget picker-type="fk" :disable-alpha="true"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, type Ref} from "vue";
import {ChevronLeftIcon} from "lucide-vue-next";
import EmojiPicker from 'vue3-emoji-picker'
import {useI18n} from "vue-i18n";
import emojis from "@/assets/locals/emoji-picker/emoji_categories_zh.json"
import 'vue3-emoji-picker/css'
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/dist/style.css";

const emojiOpen = ref(true);
const colorOpen = ref(false);

const emojiInputRef: Ref<HTMLInputElement | null> = ref(null);

const emojiValue = ref('');

const i18n = useI18n();

function clickEmoji() {
  emojiOpen.value = true;
  colorOpen.value = false;
}

function clickColor() {
  emojiOpen.value = false;
  colorOpen.value = true;
}

function onSelectEmoji(emojiData) {
  emojiValue.value = emojiData.i;
}

</script>

<style scoped lang="less">

</style>
