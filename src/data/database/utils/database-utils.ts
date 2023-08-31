import {useDatabaseStores} from "@/stores/database-stores";
import {SettingEntity} from "@/data/database/entities/SettingEntity";
import {DefSetting} from "@/data/models/DefSetting";

/**
 * 检查表是否有内容
 * @param entity 要检查的表
 */
export async function checkTableIsInit(entity: any) {
    const dbStore = useDatabaseStores();
    const entityManager = dbStore.entityManager;

    const entities = await entityManager?.find(entity);

    return (entities?.length !== 0 && entities?.length !== undefined);
}

/**
 * 检查设置表是否完整，并自动修复
 * @return 如果返回false,则代表表没有初始化（没有内容）,如何返回Map,则value为false的实体不完整
 */
export async function checkSettingTableIsIntact(): Promise<Map<string, boolean> | boolean> {
        const dbStore = useDatabaseStores();
        const entityManager = dbStore.entityManager;

        const entities = await entityManager?.find(SettingEntity);
        const result: Map<string, boolean> = new Map();

        // TODO 可能报错
        if (entities !== undefined) {
            for (const [name, value] of Object.entries(DefSetting)) {
                const e = await entityManager?.find(SettingEntity, {where: {"key": name}})

                if (e === undefined) {
                    // 如果找不到设置项
                    result.set(name, false);
                    entityManager?.save(SettingEntity, {key: name, value: value})
                    continue;
                }

                if (e?.length == 0 || e?.length > 1) {
                    // 找到的设置项不止一个或者没有
                    result.set(name, false);
                    entityManager?.delete(SettingEntity, {key: name})
                    entityManager?.save(SettingEntity, {key: name, value: value})
                    continue;
                }

                // 设置项一切正常
                result.set(name, true);
            }
            return result;
        }

        // Setting表不存在内容
        // 使用DefSetting填充
        for (const [name, value] of Object.entries(DefSetting)) {
            entityManager?.save(SettingEntity, {key: name, value: value})
        }
        return false;
}
