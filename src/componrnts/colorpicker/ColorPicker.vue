<template>
  <div v-bind="$attrs" class="min-h-[380px] min-w-[280px] bg-base-100 shadow-lg border border-neutral/10 rounded-[20px] p-[25px]">
    <div class="flex flex-col justify-start items-center w-full h-full">
      <div class="flex flex-row justify-center items-center w-full h-[43px] bg-base-200 rounded-[25px]">
        <div class="d-tabs d-tabs-boxed color-picker-tabs shadow-[17px_17px_28px_0_hsl(var(--n))/10] w-full h-full flex flex-row justify-around items-center px-[25px]">
          <a :class="`${presetOpen?'d-tab-active':''} d-tab font-medium w-[45%] color-picker-tab-transition`" @click="onClickPreset">预设</a>
          <a :class="`${presetOpen?'':'d-tab-active'} d-tab font-medium w-[45%] color-picker-tab-transition`" @click="onClickCustom">自定义</a>
        </div>
      </div>
      <div v-if="presetOpen" class="flex flex-col justify-center items-center w-full h-full mt-[18px]">
        <div v-if="!selectColorCodeOpen" class="flex flex-row justify-start w-full items-center flex-wrap gap-[12px]">
          <button ref="colorBtns" v-for="(v, k) in colors" :key="k" type="button"
                  :title="`select ${k}`" class="d-btn min-h-0 h-[48px] w-[30%]"
                  :style="`background-color: ${v[defaultColorCode]};`"
                  @click="onClickColorBtn(k)"
          >
            <a class="font-medium normal-case">{{ i18n.t(`colorPicker.color.${k}`) }}</a>
          </button>
        </div>
        <div v-else class="w-full">
          <overlay-scrollbars-component class="max-h-[280px] w-full" defer element="div" :options="{
              overflow: {
                x: 'hidden',
              },
              scrollbars: {
                autoHide: 'leave',
                autoHideDelay: 200,
                clickScroll: true,
                theme: 'os-theme-dark',
              }
            }" @os-scroll="onScroll"
          >
            <div ref="scrollContent" class="h-full w-full flex flex-row justify-start items-center flex-wrap gap-[12px]">
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
            </div>
          </overlay-scrollbars-component>
        </div>
      </div>
      <div v-else class="relative flex flex-col justify-around items-center w-full h-full mt-[18px]">
        <div ref="colorIndicator" class="absolute left-[8px] top-[0] w-[32px] h-[32px] rounded-full"></div>
        <div id="iro-color-picker" class="py-[10px]"></div>
        <div class="flex flex-row justify-around items-center pt-[8px] h-[38px]" :style="{ width: `${props.iroColorPickerWidth}vw` }">
          <div class="d-join h-full rounded-[6px]">
              <div class="d-join-item h-full w-[28px] bg-primary flex flex-row justify-center items-center">
                <a class="font-normal text-base-100">R:</a>
              </div>
              <input ref="rInput" @input="onRGBCodeInput($event)" class="d-input d-input-bordered d-join-item min-h-0 min-w-0 h-full w-[40px] p-0 caret-neutral text-center text-neutral font-light">
          </div>
          <div class="d-join h-full rounded-[6px]">
            <div class="d-join-item h-full w-[28px] bg-primary flex flex-row justify-center items-center">
              <a class="font-normal text-base-100">G:</a>
            </div>
            <input ref="gInput" @input="onRGBCodeInput($event)" class="d-input d-input-bordered d-join-item min-h-0 min-w-0 h-full w-[40px] p-0 caret-neutral text-center text-neutral font-light">
          </div>
          <div class="d-join h-full rounded-[6px]">
            <div class="d-join-item h-full w-[28px] bg-primary flex flex-row justify-center items-center">
              <a class="font-normal text-base-100">B:</a>
            </div>
            <input ref="bInput" @input="onRGBCodeInput($event)" class="d-input d-input-bordered d-join-item min-h-0 min-w-0 h-full w-[40px] p-0 caret-neutral text-center text-neutral font-light">
          </div>
        </div>
        <div v-if="!props.disableConfirmBtn" class="w-full flex flex-row justify-end items-center pt-[30px] px-[20px]">
          <button type="button" title="back" class="d-btn d-btn-circle d-btn-primary h-[52px] w-[52px]" @click="onClickDoneBtn">
            <check-icon class="h-[30px] w-[30px] text-base-100" stroke-width="2.5"/>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import OpenColor from "open-color";
import Color from "colorjs.io";
import {onMounted, onUpdated, reactive, type Ref, ref, defineOptions, defineEmits, defineProps, watch} from "vue";
import {ChevronLeftIcon, CheckIcon} from "lucide-vue-next";
import { OverlayScrollbarsComponent } from "overlayscrollbars-vue";
import * as fun from "@/utils/fun";
import {useI18n} from "vue-i18n";
import iro from '@jaames/iro';
import {IroColorPicker} from "@jaames/iro/dist/ColorPicker.d.ts";

const emit = defineEmits<{
  'selectColor': [colorHex: string]
}>();

const props = defineProps({
  'colorHex': {
    type: String,
    default: ''
  },
  'iroColorPickerWidth': {
    type: Number,
    default: 59
  },
  'disableConfirmBtn': {
    type: Boolean,
    default: false,
  }
});

const presetOpen = ref(true);
const selectColorCodeOpen = ref(false);
const colorBtns: Ref<Array<HTMLButtonElement | null>> = ref([]);
const colorCodeBtns: Ref<Array<HTMLButtonElement | null>> = ref([]);
const scrollContent: Ref<HTMLDivElement | null> = ref(null);
const backBtn: Ref<HTMLButtonElement | null> = ref(null);
const showBackBtn = ref(true);
const colorIndicator: Ref<HTMLDivElement | null> = ref(null);
const iroColorPicker: Ref<IroColorPicker | undefined> = ref();
const rInput: Ref<HTMLInputElement | null> = ref(null);
const gInput: Ref<HTMLInputElement | null> = ref(null);
const bInput: Ref<HTMLInputElement | null> = ref(null);

const selectColor = ref('');
const i18n = useI18n();

const colorCode = reactive([50, 100, 200, 300, 400, 500, 600, 700, 800, 900]);
const defaultColorCode = ref(400);
// eslint-disable-next-line vue/no-setup-props-destructure
const iroSelectColor: Ref<string | undefined> = ref(props.colorHex === '' ? fun.randomColor() : undefined);
let lastScrollTop = 0;

const colors = getPresetColors(OpenColor);

if (props.disableConfirmBtn) {
  watch(iroSelectColor, (colorHex: string) => {
    emit('selectColor', colorHex);
  });
}

// eslint-disable-next-line vue/no-setup-props-destructure
watch(() => props.iroColorPickerWidth, (value) => {
  iroColorPicker.value?.resize(fun.getPxfromVw(value));
});

defineOptions({
  inheritAttrs: false
});

function onClickPreset() {
  presetOpen.value = true;
}

function onClickCustom() {
  presetOpen.value = false;
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

function onScroll() {
  const scrollTop = scrollContent.value?.parentElement?.scrollTop;
  if (scrollTop !== undefined) {
    if (scrollTop > lastScrollTop && scrollTop - lastScrollTop > 2) {
      showBackBtn.value = false;
    } else if (scrollTop < lastScrollTop && lastScrollTop - scrollTop > 2) {
      showBackBtn.value = true;
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }
}

function onIroColorPickerColorInitChange(color) {
  iroSelectColor.value = color.hexString;

  // 更新颜色指示器
  colorIndicator.value!.style.setProperty('background-color', color.hexString);

  // 更新RGB输入框
  rInput.value!.value = color.rgb.r.toString();
  gInput.value!.value = color.rgb.g.toString();
  bInput.value!.value = color.rgb.b.toString();
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

function onClickDoneBtn() {
  emit('selectColor', <string>(iroSelectColor.value === undefined? props.colorHex : iroSelectColor.value));
}

function updateTextColor() {
  const update = (btns: Ref<Array<HTMLButtonElement | null>>) => {
    btns.value.forEach((e) =>{
      const colorText = e!.getElementsByTagName('a')[0];
      const backgroundColor = e!.style.backgroundColor;
      colorText.style.setProperty('color', `hsl(var(${fun.getForegroundColor(backgroundColor)}))`);
    });
  }

  if (presetOpen.value) {
    selectColorCodeOpen.value ? update(colorCodeBtns) : update(colorBtns);
  }
}

function initIro() {
  if (!presetOpen.value && document.getElementsByClassName('IroColorPicker').length === 0) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    iroColorPicker.value = new iro.ColorPicker('#iro-color-picker', {
      width: fun.getPxfromVw(props.iroColorPickerWidth),
      color: iroSelectColor.value === undefined? props.colorHex : iroSelectColor.value,
    });

    iroColorPicker.value?.on(['color:init', 'color:change'], onIroColorPickerColorInitChange);
  }
}

function onRGBCodeInput(e: InputEvent) {
  // 获取输入目标，输入类型和输入数据
  const target = e.target as HTMLInputElement;
  const inputData = e.data;

  // 检测函数
  const checkAndFixValue = (input: string | null) => {
    if (input === null) return input;
    // 空文本不做处理
    if (input.replaceAll(/\s/g, '') === '') target.value = target.value.replaceAll(/\s/g, '');

    // 如果输入值不是数字，删除最后一个非数字字符
    if (isNaN(Number(input))) {
      target.value = target.value.substring(0, target.value.lastIndexOf(<string>input));
    }
    // 如果输入值是整数，限制其范围在0到255之间
    if (Number.isInteger(Number(input))) {
      target.value = Math.max(0, Math.min(255, Number(target.value))).toString();
    }
    // 如果输入值是小数，删除最后一个非数字字符
    if (!Number.isInteger(Number(input))) {
      target.value = target.value.substring(0, target.value.lastIndexOf(<string>input));
    }
  };

  inputData !== null ? checkAndFixValue(inputData) : checkAndFixValue(target.value)

  // 更新颜色
  const r = Number(rInput.value!.value);
  const g = Number(gInput.value!.value);
  const b = Number(bInput.value!.value);

  if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
    const color = new Color('srgb', [r / 255, g / 255, b / 255]);
    colorIndicator.value!.style.setProperty('background-color', color.toString({format: 'hex'}));
    iroColorPicker.value?.setColors([color.toString({format: 'hex'})]);
  }

}

onMounted(() => {
  // 更新颜色按钮字体颜色
  updateTextColor();

  // 加载iro
  initIro();

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    iroColorPicker.value?.resize(fun.getPxfromVw(props.iroColorPickerWidth));
  });
});

onUpdated(() => {
  // 更新颜色按钮字体颜色
  updateTextColor();

  // 加载iro
  initIro();
});

</script>

<style scoped lang="less">

</style>
