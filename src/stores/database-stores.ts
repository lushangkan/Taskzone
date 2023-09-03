import {defineStore} from "pinia";
import {reactive, type Ref, ref, UnwrapNestedRefs, watch} from "vue";
import {SQLiteConnection} from "@capacitor-community/sqlite";
import {DataSource, EntityManager} from "typeorm";
import {checkAppTableStatus} from "@/data/database/utils/database-utils";

import {AppTableStatus} from "@/data/interface/AppTableStatus";


export const useDatabaseStores = defineStore('databaseStore', () => {
    const databaseNames = ['taskzoneDB'];
    const sqliteConnection: Ref<SQLiteConnection | undefined> = ref();
    const dataSource: Ref<DataSource | undefined> = ref()
    const platform: Ref<string | undefined> = ref();

    const entityManager: Ref<EntityManager | undefined> = ref();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const tableStatus: UnwrapNestedRefs<AppTableStatus> = reactive({
        taskEntity: undefined,
        tagEntity: undefined,
        taskGroupEntity: undefined,
        settingEntity: undefined
    });

    watch(() => dataSource.value?.isInitialized, (isInitialized) => {
        if (isInitialized) {
            entityManager.value = <EntityManager>dataSource.value?.manager;
        }
    });

    async function updateStatus(Entity?: any) {
        const status = await checkAppTableStatus(Entity)
        if (status !== undefined) {
            Object.assign(tableStatus, Object.fromEntries(Object.entries(status).filter(([, value]) => value !== undefined)));
        }
    }

    return {sqliteConnection, platform, dataSource, entityManager, tableStatus, updateStatus, databaseNames};
});
