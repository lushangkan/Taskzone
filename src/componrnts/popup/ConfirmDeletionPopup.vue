<template>
    <div ref="mask" @click="onClickMask" class="fixed z-[40] w-screen h-screen left-0 top-0 flex flex-col justify-center items-center bg-neutral/40">
        <div ref="popup" class="h-[235px] w-[300px] rounded-[18px] bg-base-100 flex flex-col justify-between items-center py-[25px]">
          <alert-circle-icon class="h-[60px] w-[60px] stroke-[1.6px] stroke-error"/>
          <span class="text-neutral text-[15px] font-light text-center">{{ props.prompt }}</span>

          <div class="w-full flex flex-row justify-center items-center px-[40px] gap-[18px]">
            <button type="button" title="Cancel"
                    @click="onClickCancelBtn"
                    class="h-[42px] min-h-0 w-[100px] d-btn d-btn-base-300">
              <span class="text-neutral text-[15px] font-normal">取消</span>
            </button>
            <button type="button" title="Cancel"
                    @click="onClickDeleteBtn"
                    class="h-[42px] min-h-0 w-[100px] d-btn d-btn-primary">
              <span :class="`text-base-100 text-[15px] font-normal ${processing?'d-loading d-loading-spinner':''}`">删除</span>
            </button>
          </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { AlertCircleIcon } from 'lucide-vue-next';
import {ref, Ref, watch} from "vue";

const props = defineProps({
  prompt: {
    type: String,
    required: true
  }
});

const emit = defineEmits<{
  (e: 'clickCancelBtn'): void
  (e: 'clickDeleteBtn'): void
}>();

const mask: Ref<HTMLDivElement | null> = ref(null);
const popup: Ref<HTMLDivElement | null> = ref(null);

const processing = ref(false);

function onClickMask(event: UIEvent) {
  if (event.target === mask.value) {
    emit('clickCancelBtn');
  }
}

function onClickCancelBtn() {
  emit('clickCancelBtn');
}

function onClickDeleteBtn() {
  emit('clickDeleteBtn');
}

const startProcessing = () => {
  processing.value = true;
}

const stopProcessing = () => {
  processing.value = false;
}

defineExpose({
  startProcessing,
  stopProcessing
});
</script>

<style scoped lang="less">

</style>
