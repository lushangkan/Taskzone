<template>
 <div ref="cardRef" v-if="taskGroupEntity?.dayTaskDate === null"
      class="btn-transition w-full h-[48px] rounded-[16px] flex justify-start items-center px-[12px] gap-[8px]" :style="{ backgroundColor: taskGroupEntity?.color }">
   <span v-if="taskGroupEntity?.icon !== null" class="text-[22px]">{{ taskGroupEntity.icon }}</span>
   <span class="truncate font-medium" style="color: hsl(var(--fg));">{{ taskGroupEntity.name }}</span>
 </div>
</template>

<script setup lang="ts">

import {TaskGroupEntity} from "@/data/database/entities/TaskGroupEntity";
import {getForegroundColor, getWhiteBlackCssVar} from "@/utils/fun";
import {onMounted, type Ref, ref, watch} from "vue";

const props = defineProps({
  taskGroupEntity: {
    type: TaskGroupEntity,
    default: undefined,
  }
});

const cardRef: Ref<HTMLDivElement | null> = ref(null);

function initColorVar() {
  const foregroundColor = getForegroundColor(window.getComputedStyle(cardRef.value!).backgroundColor);
  const whiteBlackCss = getWhiteBlackCssVar();

  cardRef.value?.style.setProperty('--fg', `var(${foregroundColor === 'white' ? whiteBlackCss.white : whiteBlackCss.black})`);
}

watch(cardRef, (value) => {
  if (value !== null) initColorVar();
});

</script>

<style scoped lang="less">

</style>
