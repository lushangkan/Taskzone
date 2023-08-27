<template>
  <div v-bind="$attrs" class="min-h-[380px] min-w-[280px] bg-base-100 shadow-lg border border-neutral/10 rounded-[20px] p-[25px]">
    <div class="flex flex-col justify-start items-center w-full h-full">
      <div class="flex flex-row justify-center items-center w-full h-[43px] bg-base-200 rounded-[25px]">
        <div class="d-tabs d-tabs-boxed shadow-[17px_17px_28px_0_hsl(var(--n))/10] w-full h-full flex flex-row justify-around items-center px-[25px]">
          <a :class="`${presetOpen?'d-tab-active':''} d-tab font-medium w-[45%] color-picker-tab-transition`" @click="onClickPreset">预设</a>
          <a :class="`${customOpen?'d-tab-active':''} d-tab font-medium w-[45%] color-picker-tab-transition`" @click="onClickCustom">自定义</a>
        </div>
      </div>
      <div v-if="presetOpen" class="flex flex-col justify-center items-center w-full h-full mt-[18px]">
        <div v-if="!selectColorCodeOpen" class="flex flex-row justify-start items-center flex-wrap gap-[12px]">
          <button ref="colorBtns" v-for="(v, k) in colors" :key="k" type="button"
                  :title="`select ${k}`" class="d-btn min-h-0 h-[48px] w-[80px]"
                  :style="`background-color: ${v[defaultColorCode]};`"
                  @click="onClickColorBtn(k)"
          >
            <a class="font-medium normal-case">{{ i18n.t(`colorPicker.color.${k}`) }}</a>
          </button>
        </div>
        <div v-else class="w-full">
          <custom-scrollbar ref="scrollContent" @ps-scroll-y="onScroll" :swipeEasing="true"
                            class="max-h-[280px] w-full flex flex-row justify-start items-center flex-wrap gap-[12px]"
                            :settings="{suppressScrollX: true}"
          >
            <Transition name="back-btn">
              <button ref="backBtn" v-show="showBackBtn" type="button" title="close" @click="selectColorCodeOpen=false"
                      class="d-btn d-btn-circle bg-base-100 h-[35px] w-[35px] min-h-0 fixed flex flex-row justify-center items-center z-10 mb-[67%] ml-[0.8%]">
                <chevron-left-icon class="h-[30px] w-[30px] text-neutral" stroke-width="1.6"/>
              </button>
            </Transition>
            <button ref="colorCodeBtns" v-for="(v, k) in colors[selectColor]" :key="k" type="button"
                    :title="`select ${selectColor}-${k}`" @click="onClickColorCodeBtn(k)"
                    class="d-btn min-h-0 h-[48px] w-[45%] text-current" :style="`background-color: ${v};`">
              <a class="font-medium normal-case">{{ i18n.t(`colorPicker.color.${selectColor}`)+ '-' + k }}</a>
            </button>
          </custom-scrollbar>
        </div>
      </div>
      <div v-else-if="customOpen" class="flex flex-col justify-around items-center w-full h-full  mt-[18px]">

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import OpenColor from "open-color";
import {onMounted, onUpdated, reactive, type Ref, ref, defineOptions, defineEmits} from "vue";
import {ChevronLeftIcon} from "lucide-vue-next";
import CustomScrollbar from 'vue-custom-scrollbar/src/vue-scrollbar.vue'
import "vue-custom-scrollbar/dist/vueScrollbar.css"
import * as fun from "@/utils/fun";
import {useI18n} from "vue-i18n";

const presetOpen = ref(true);
const customOpen = ref(false);
const selectColorCodeOpen = ref(false);
const colorBtns: Ref<Array<HTMLButtonElement | null>> = ref([]);
const colorCodeBtns: Ref<Array<HTMLButtonElement | null>> = ref([]);
const backBtn: Ref<HTMLButtonElement | null> = ref(null);
const showBackBtn = ref(true);
const scrollContent: Ref<any> = ref(null)

const selectColor = ref('');
const i18n = useI18n();

const colorCode = reactive([50, 100, 200, 300, 400, 500, 600, 700, 800, 900]);
const defaultColorCode = ref(400);
let lastScrollTop = 0;

const colors = getPresetColors(OpenColor);

const emit = defineEmits<{
  'selectColor': (colorHex: string) => void
}>();

defineOptions({
  inheritAttrs: false
})

function onClickPreset() {
  presetOpen.value = true;
  customOpen.value = false;
}

function onClickCustom() {
  presetOpen.value = false;
  customOpen.value = true;
}

function onClickColorBtn(colorName: string) {
  selectColorCodeOpen.value = true;
  selectColor.value = colorName;
}

function onClickColorCodeBtn(colorCode: number | string) {
  const colorHex = colors[selectColor.value][colorCode];
  emit('selectColor', colorHex);
  selectColorCodeOpen.value = false;
}

function getPresetColors(openColor: OpenColor) {
  const colors = reactive({});
  for (const [key, value] of Object.entries(openColor)) {
    if (key === 'black' || key === 'white') continue;
      colors[key] = {};
    for (let i = 0; i < value.length; i++) {
      colors[key][colorCode[i]] = value[i];
    }
  }

  return colors;
}

function onScroll() {
  const scrollTop = scrollContent.value!.$el.scrollTop;
  if (scrollTop > lastScrollTop && scrollTop - lastScrollTop > 2) {
    showBackBtn.value = false;
  } else if (scrollTop < lastScrollTop && lastScrollTop - scrollTop > 2) {
    showBackBtn.value = true;
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}

function updateTextColor() {
  if (selectColorCodeOpen.value && presetOpen.value && !customOpen.value) {
    colorCodeBtns.value.forEach((e) => {
      const colorCodeText = e!.getElementsByTagName('a')[0];
      const backgroundColor = e!.style.backgroundColor;
      const textColor = fun.getTextColor(backgroundColor);
      const blackWhiteVar = fun.getWhiteBlackCssVar();
      if (textColor === 'black') {
        colorCodeText.style.setProperty('color', `hsl(var(${blackWhiteVar.black}))`);
      } else if (textColor === 'white') {
        colorCodeText.style.setProperty('color', `hsl(var(${blackWhiteVar.white}))`);
      } else {
        colorCodeText.style.setProperty('color', 'inherit');
      }
    })
  } else if (!selectColorCodeOpen.value && presetOpen.value && !customOpen.value) {
    colorBtns.value.forEach((e) =>{
      const colorText = e!.getElementsByTagName('a')[0];
      const backgroundColor = e!.style.backgroundColor;
      const textColor = fun.getTextColor(backgroundColor);
      const blackWhiteVar = fun.getWhiteBlackCssVar();
      if (textColor === 'black') {
        colorText.style.setProperty('color', `hsl(var(${blackWhiteVar.black}))`);
      } else if (textColor === 'white') {
        colorText.style.setProperty('color', `hsl(var(${blackWhiteVar.white}))`);
      } else {
        colorText.style.setProperty('color', 'inherit');
      }
    })
  }
}

onMounted(() => {
  // 更新颜色按钮字体颜色
  updateTextColor();
})

onUpdated(() => {
  // 更新颜色按钮字体颜色
  updateTextColor();
});

</script>

<style scoped lang="less">

</style>
