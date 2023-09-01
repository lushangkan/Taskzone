import {useDatabaseStores} from "@/stores/database-stores";
import {SettingEntity} from "@/data/database/entities/SettingEntity";
import {DefSetting} from "@/data/models/DefSetting";
import {TableStatus} from "@/data/enum/TableStatus";
import {TaskEntity} from "@/data/database/entities/TaskEntity";
import {TagEntity} from "@/data/database/entities/TagEntity";
import {TaskGroupEntity} from "@/data/database/entities/TaskGroupEntity";
import {AppTableStatus} from "@/data/interface/AppTableStatus";

/**
 * 检查表是否有内容
 * @param entity 要检查的表
 */
export async function checkTableIsInit(entity: any) {
    const dbStore = useDatabaseStores();
    const entityManager = dbStore.entityManager;

    const entities = await entityManager?.find(entity);

    return (entities?.length !== 0 && entities?.length !== undefined)? TableStatus.Intact: TableStatus.Empty;
}

/**
 * 检查设置表是否完整，并自动修复
 * @return 如果返回false,则代表表没有初始化（没有内容）,如何返回Map,则value为false的实体不完整
 */
export async function checkSettingTableIsIntact(): Promise<Map<string, TableStatus> | TableStatus> {
        const dbStore = useDatabaseStores();
        const entityManager = dbStore.entityManager;

        const entities = await entityManager?.find(SettingEntity);
        const result: Map<string, TableStatus> = new Map();

        // TODO 可能报错
        if (entities !== undefined) {
            for (const [name, value] of Object.entries(DefSetting)) {
                const e = await entityManager?.find(SettingEntity, {where: {"key": name}})

                if (e === undefined || e?.length == 0) {
                    // 如果找不到设置项
                    result.set(name, TableStatus.Defect);
                    entityManager?.save(SettingEntity, {key: name, value: value})
                    continue;
                }

                if (e?.length > 1) {
                    // 找到的设置项不止一个
                    result.set(name, TableStatus.Defect);
                    entityManager?.delete(SettingEntity, {key: name})
                    entityManager?.save(SettingEntity, {key: name, value: value})
                    continue;
                }

                // 设置项一切正常
                result.set(name, TableStatus.Intact);
            }

            return Object.entries(result).filter(([, value]) => value === TableStatus.Defect).length === 0 ? TableStatus.Intact: TableStatus.Defect;
        }

        // Setting表不存在内容
        // 使用DefSetting填充
        for (const [name, value] of Object.entries(DefSetting)) {
            entityManager?.save(SettingEntity, {key: name, value: value})
        }
        return TableStatus.Empty;
}

/**
 * 检查所有表的状态, 如果传入Entity,则只检查该表
 * @param Entity 要检查的表
 */
export async function checkAppTableStatus(Entity?: any) {
    const appTableStatus: AppTableStatus = {
        taskEntity: undefined,
        tagEntity: undefined,
        taskGroupEntity: undefined,
        settingEntity: undefined
    }

    for (const entity of Entity !== undefined? [Entity] : [TagEntity, TaskEntity, TaskGroupEntity, SettingEntity]) {
        if (entity === SettingEntity) {
            const status = await checkSettingTableIsIntact();
            appTableStatus.settingEntity = status instanceof Map ? Object.entries(status).filter(([, value]) => value === TableStatus.Defect).length === 0 ? TableStatus.Intact : TableStatus.Defect : status
            continue;
        }

        const status = await checkTableIsInit(entity);
        switch (entity) {
            case TagEntity:
                appTableStatus.tagEntity = status;
                continue;
            case TaskEntity:
                appTableStatus.taskEntity = status;
                continue;
            case TaskGroupEntity:
                appTableStatus.taskGroupEntity = status;
        }

    }

    return appTableStatus;

}

