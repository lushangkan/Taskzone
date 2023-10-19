<template>
  <div ref="tagsRef" v-if="props.tagEntity !== undefined && props.tagEntity !== null" class="flex flex-row justify-start items-center px-[8px] py-[1px] h-full w-[80px] gap-[1px] rounded-full whitespace-nowrap" :style="{
             '--bg': `var(${tagBgColor})`,
             '--fg': `var(${tagFgColor})`,
             'background-color': props.tagEntity?.color === undefined? 'hsl(var(--bg))' : props.tagEntity?.color
           }">
    <span v-if="props.tagEntity?.icon !== undefined" class="text-[16px] leading-normal">{{ props.tagEntity?.icon }}</span>
    <span class="text-[hsl(var(--fg))] text-[14px] font-normal leading-normal text-clip overflow-hidden">{{ props.tagEntity?.name }}</span>
  </div>
</template>

<script setup lang="ts">

import {getForegroundColor} from "@/utils/fun";
import {onMounted, ref} from "vue";
import {TagEntity} from "@/data/database/entities/TagEntity";

const props = defineProps({
  tagEntity: {
    type: TagEntity,
  }
});

const tagFgColor = ref('--b1');
const tagBgColor = ref('--n');

const tagsRef = ref<HTMLDivElement | null>(null);

function initColorVar() {
  if (tagsRef.value !== null) {
    const tagForegroundColor = getForegroundColor(window.getComputedStyle(tagsRef.value!).backgroundColor);

    tagBgColor.value = tagForegroundColor === '--b1'? '--n' : '--b1';
    tagFgColor.value = tagForegroundColor === '--b1'? '--b1' : '--n';
  }
}

onMounted(() => {
  initColorVar();
});

</script>

<style scoped lang="less">

</style>
