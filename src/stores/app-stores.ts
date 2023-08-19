import {defineStore} from "pinia";
import {ref} from "vue";

export const useAppStores = defineStore('appStore', () => {
    const addTaskBtnShow = ref(true);
    const isSupportEmoji = ref();

    return {addTaskBtnShow, isSupportEmoji};
});
