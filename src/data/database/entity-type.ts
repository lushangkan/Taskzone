import {TagEntity} from "@/data/database/entities/TagEntity";
import {TaskEntity} from "@/data/database/entities/TaskEntity";
import {SettingEntity} from "@/data/database/entities/SettingEntity";
import {TaskGroupEntity} from "@/data/database/entities/TaskGroupEntity";
import {AppPropEntity} from "@/data/database/entities/AppPropEntity";

const entityType: {
    [key: string]: typeof TagEntity | typeof TaskEntity | typeof SettingEntity | typeof TaskGroupEntity | typeof AppPropEntity
} = {
    'tagEntity': TagEntity,
    'taskEntity': TaskEntity,
    'settingEntity': SettingEntity,
    'taskGroupEntity': TaskGroupEntity,
    'appPropEntity': AppPropEntity
}

export function getEntityType(entityName: string) : typeof TagEntity | typeof TaskEntity | typeof SettingEntity | typeof TaskGroupEntity | typeof AppPropEntity {
    return entityType[entityName];
}
