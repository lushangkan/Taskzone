<template>
  <ion-menu @ionWillClose="$emit('onmenuclose')" ref="menu" content-id="main-content" class="z-20">
    <ion-content>

    </ion-content>
  </ion-menu>
</template>

<script setup lang="ts">
import { IonMenu, IonContent } from "@ionic/vue";
import {onMounted, ref, useAttrs} from "vue";

const menu = ref<IonMenu | null>(null);

console.log(useAttrs());
</script>

<style scoped lang="less">

</style>