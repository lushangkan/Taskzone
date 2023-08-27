<template>
  <ion-page>
    <ion-content :fullscreen="true" :scroll-events=true class="bg-base-100">
      <div class="w-full h-full flex flex-col items-center justify-center gap-[20px]">
        <color-picker @select-color="onSelectColor" class="w-[320px]"/>
        <div class="flex flex-row items-center justify-around gap-[10px]">
          <div ref="colorRef" class="bg-base-300 rounded-full h-[20px] w-[20px]"/>
          <a>{{ text }}</a>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {IonPage, IonContent} from "@ionic/vue";
import ColorPicker from "@/componrnts/colorpicker/ColorPicker.vue";
import {Ref, ref} from "vue";

const colorRef: Ref<null | HTMLDivElement> = ref(null);
const text = ref('Not selected');

function onSelectColor(colorHex: string) {
  colorRef.value!.style.setProperty('background-color', colorHex);
  text.value = colorHex;
}

</script>

<style scoped lang="less">

</style>
