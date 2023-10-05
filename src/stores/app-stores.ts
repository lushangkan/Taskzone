import {defineStore} from "pinia";
import {Ref, ref} from "vue";
import mitt from 'mitt';

export const useAppStores = defineStore('appStore', () => {
    const addTaskBtnShow = ref(true);
    const isSupportEmoji = ref();
    const eventBus = mitt();

    return {addTaskBtnShow, isSupportEmoji, eventBus};
});
