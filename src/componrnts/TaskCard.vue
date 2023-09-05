<template>
  <div ref="taskCardRef" class="w-[83%] min-h-[62px] bg-lime-400 rounded-[22px] flex flex-row justify-start items-center px-[6%] gap-[15px]">
    <input @change="onCompleteChange" ref="inputRef" type="checkbox" title="Complete" checked="checked" class="d-checkbox h-[24px] min-w-[0] w-[24px] aspect-square border-[3px] border-[hsl(var(--chkbg))] rounded-full outline outline-0 outline-base-100"/>
    <div class="flex flex-row justify-start items-center h-full w-full">
      <a></a>
    </div>
  </div>
</template>
<script setup lang="ts">

import {onMounted, reactive, Ref, ref, defineProps} from "vue";
import {getForegroundColor, getWhiteBlackCssVar} from "@/utils/fun";
import {TaskEntity} from "@/data/database/entities/TaskEntity";
import anime from "animejs/lib/anime.es.js";

const props = defineProps({
  taskEntity: {
    type: TaskEntity,
    default: undefined,
  }
})

const inputRef: Ref<HTMLInputElement | null> = ref(null);
const taskCardRef: Ref<HTMLDivElement | null> = ref(null);

function onCompleteChange() {
  if (inputRef.value?.checked) {
    const dingAudio = new Audio(new URL('../assets/sounds/ding.aac', import.meta.url).href);
    dingAudio.play();
    anime({
      targets: inputRef.value,
      keyframes: [
        {'outline-width': '5vw', 'outline-offset': '0vw'},
        {'outline-width': '100vw', 'outline-offset': '100vw'}
      ],
      delay: 230,
      duration: 500,
      easing: 'easeInCubic',
      complete: () => {
        inputRef.value!.style.removeProperty('outline-width');
        inputRef.value!.style.removeProperty('outline-offset');
      }
    });
    anime({
      targets: taskCardRef.value,
      keyframes: [
        {scale: 0.95},
        {scale: 1},
      ],
      duration: 900,
      easing: 'spring(1, 100, 10, 15)',
      complete: () => {
         taskCardRef.value!.style.removeProperty('scale');
      }
    });
  }
}

onMounted(() => {
  const foregroundColor = getForegroundColor(window.getComputedStyle(taskCardRef.value!).backgroundColor);
  const whiteBlackCss = getWhiteBlackCssVar();

  inputRef.value?.style.setProperty('--chkbg', `var(${foregroundColor === 'white' ? whiteBlackCss.black : whiteBlackCss.white})`);
  inputRef.value?.style.setProperty('--chkfg', `var(${foregroundColor === 'white' ? whiteBlackCss.white : whiteBlackCss.black})`);
})

</script>
<style scoped lang="less">

</style>
