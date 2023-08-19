<template>
  <div class="flex flex-col justify-center items-center py-[29px] px-[30px]">
    <div class="flex flex-row justify-start items-center w-full pb-[10px] px-[4px]">
      <button type="button" title="close" class="d-btn d-btn-circle d-btn-ghost h-[32px] w-[32px] min-h-0">
        <chevron-left-icon class="h-[30px] w-[30px] text-neutral" stroke-width="1.6"/>
      </button>
    </div>
    <div class="d-tabs flex flex-row justify-start items-center w-full h-[32px] gap-[0] px-[9px]">
      <a @click="clickEmoji" :class="`${emojiOpen?'d-tab-active':''} d-tab d-tab-bordered tab-bordered-transition text-[14.5px]`">图标</a>
      <a @click="clickColor" :class="`${colorOpen?'d-tab-active':''} d-tab d-tab-bordered tab-bordered-transition text-[14.5px]`">颜色</a>
      <div class="relative border-transparent border-b-base-content/20 border-[3px] h-full w-[190px] left-[-1px]"/>
    </div>
    <div v-if="emojiOpen" class="flex flex-row justify-center items-center w-full h-[365px]">
      <div class="flex flex-r"
      <EmojiPicker :native="true" :group-names="groupNames"
                   :static-texts="staticText" :display-recent="true"
                   :hide-search="true"
                   class="emoji-picker shadow-none w-full h-[100%]"
      />
    </div>
    <div v-if="colorOpen" class="flex flex-row justify-center items-center w-full">

    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {ChevronLeftIcon} from "lucide-vue-next";
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'
import {useI18n} from "vue-i18n";

const emojiOpen = ref(true);
const colorOpen = ref(false);

const i18n = useI18n();

const groupNames = reactive({
  "recent": useI18n().t('emojiPicker.groupNames.recent'),
  "smileys_emotion": useI18n().t('emojiPicker.groupNames.smileys_emotion'),
  "people_body": useI18n().t('emojiPicker.groupNames.people_body'),
  "animals_nature": useI18n().t('emojiPicker.groupNames.animals_nature'),
  "food_drink": useI18n().t('emojiPicker.groupNames.food_drink'),
  "activities": useI18n().t('emojiPicker.groupNames.activities'),
  "travel_places": useI18n().t('emojiPicker.groupNames.travel_places'),
  "objects": useI18n().t('emojiPicker.groupNames.objects'),
  "symbols": useI18n().t('emojiPicker.groupNames.symbols'),
  "flags": useI18n().t('emojiPicker.groupNames.flags'),
});

const staticText = reactive({
  "placeholder": useI18n().t('emojiPicker.staticText.placeholder'),
  "skinTone": useI18n().t('emojiPicker.staticText.skinTone'),
});

function clickEmoji() {
  emojiOpen.value = true;
  colorOpen.value = false;
}

function clickColor() {
  emojiOpen.value = false;
  colorOpen.value = true;
}


</script>

<style scoped lang="less">

</style>
