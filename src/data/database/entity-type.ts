import {TagEntity} from "@/data/database/entities/TagEntity";
import {TaskEntity} from "@/data/database/entities/TaskEntity";
import {SettingEntity} from "@/data/database/entities/SettingEntity";
import {TaskGroupEntity} from "@/data/database/entities/TaskGroupEntity";

const entityType: {
    [key: string]: typeof TagEntity | typeof TaskEntity | typeof SettingEntity | typeof TaskGroupEntity
} = {
    'tagEntity': TagEntity,
    'taskEntity': TaskEntity,
    'settingEntity': SettingEntity,
    'taskGroupEntity': TaskGroupEntity
}

export function getEntityType(entityName: string) : typeof TagEntity | typeof TaskEntity | typeof SettingEntity | typeof TaskGroupEntity {
    return entityType[entityName];
}
