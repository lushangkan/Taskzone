import {defineStore} from "pinia";
import {ref} from "vue";

export const useDatabaseStores = defineStore('databaseStore', () => {
    const sqliteConnection = ref();
    const platform = ref();

    return {sqliteConnection, platform};
});