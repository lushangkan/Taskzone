import {defineStore} from "pinia";
import {Ref, ref} from "vue";

export const useAppStores = defineStore('appStore', () => {
    const addTaskBtnShow = ref(true);
    const isSupportEmoji = ref();

    const mainScrollListeners: Ref<{initialized: Array<() => void>}> = ref({initialized: []});

    return {addTaskBtnShow, isSupportEmoji, mainScrollListeners};
});
