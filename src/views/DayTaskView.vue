<template>
  <ion-page>
    <ion-content :fullscreen="true" :scroll-events=true>
      <div class="w-full flex flex-col justify-start items-center pt-[150px]" @ionScroll="console.log($event)">
        <div class="bg-warning h-[150vh] w-3/4"></div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {IonContent, IonPage} from "@ionic/vue";
</script>


<style scoped lang="less">

</style>