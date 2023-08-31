import {defineStore} from "pinia";
import {type Ref, ref, watch} from "vue";
import {SQLiteConnection} from "@capacitor-community/sqlite";
import {DataSource, EntityManager} from "typeorm";

export const useDatabaseStores = defineStore('databaseStore', () => {
    const sqliteConnection: Ref<SQLiteConnection | undefined> = ref();
    const dataSource: Ref<DataSource | undefined> = ref()
    const platform: Ref<string | undefined> = ref();

    const entityManager: Ref<EntityManager | undefined> = ref();

    watch(() => dataSource.value?.isInitialized, (isInitialized) => {
        if (isInitialized) {
            entityManager.value = <EntityManager>dataSource.value?.manager;
        }
    });


    return {sqliteConnection, platform, dataSource, entityManager};
});
