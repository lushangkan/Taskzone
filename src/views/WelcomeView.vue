<template>
  <div class="h-screen w-screen flex flex-col justify-center items-center gap-2.5">
    <vue3-lottie :animationData="DottedLineFace" class="h-[90px] w-[90px]"/>
    <div class="text-center text-black text-sm font-thin">{{ $t('page.welcome.tipsLine') }}</div>
  </div>
</template>

<script setup lang="ts">
import {IonContent} from "@ionic/vue";
import DottedLineFace from '@/assets/emoji/notoemoji/dotted-line-face.json'
import {Vue3Lottie} from "vue3-lottie";
</script>

<style scoped lang="less">

</style>