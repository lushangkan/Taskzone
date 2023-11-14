import {TableStatus} from "../enum/TableStatus";

export interface AppTableStatus {
    taskEntity: TableStatus | undefined;
    tagEntity: TableStatus | undefined;
    taskGroupEntity: TableStatus | undefined;
    settingEntity: TableStatus | undefined
    appPropEntity: TableStatus | undefined
}

