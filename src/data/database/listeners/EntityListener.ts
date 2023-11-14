import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    LoadEvent,
    RecoverEvent,
    RemoveEvent,
    SoftRemoveEvent,
    UpdateEvent
} from "typeorm";
import {Promise} from "cypress/types/cy-bluebird";
import {useDatabaseStores} from "@/stores/database-stores";
import {useAppStores} from "@/stores/app-stores";
import EventType from "@/event/EventType";
import {TagEntity} from "@/data/database/entities/TagEntity";
import {TaskEntity} from "@/data/database/entities/TaskEntity";
import {SettingEntity} from "@/data/database/entities/SettingEntity";
import {TaskGroupEntity} from "@/data/database/entities/TaskGroupEntity";
import {getEntityType} from "@/data/database/entity-type";
import {AppPropEntity} from "@/data/database/entities/AppPropEntity";

@EventSubscriber()
export class EntityListener implements EntitySubscriberInterface {

    private dbStore = useDatabaseStores();
    private appStore = useAppStores();

    afterLoad(entity: any, event?: LoadEvent<any>): Promise<any> | void {
        this.appStore.eventBus.emit(EventType.DB_AFTER_LOAD, event);
    }

    afterInsert(event: InsertEvent<any>): Promise<any> | void {
        if (event.entity !== null && event.entity !== undefined) this.dbStore.updateStatus(event.entity.constructor);


        this.appStore.eventBus.emit(EventType.DB_ALL, event);
        this.appStore.eventBus.emit(EventType.DB_AFTER_INSERT, event);
    }

    afterRemove(event: RemoveEvent<any>): Promise<any> | void {
        if (event.entity !== null && event.entity !== undefined) {
            this.dbStore.updateStatus(event.entity.constructor);
        } else if (event.entityId !== null || event.entityId) {
            Object.entries(event.entityId).forEach(([repositoryIdName, id]) => {
                const entity: typeof TagEntity | typeof TaskEntity | typeof SettingEntity | typeof TaskGroupEntity | typeof AppPropEntity = getEntityType(repositoryIdName.replaceAll('Id', ''));
                this.dbStore.updateStatus(entity);
            })
        }

        this.appStore.eventBus.emit(EventType.DB_ALL, event);
        this.appStore.eventBus.emit(EventType.DB_AFTER_REMOVE, event);
    }

    afterSoftRemove(event: SoftRemoveEvent<any>): Promise<any> | void {
        if (event.entity !== null && event.entity !== undefined) {
            this.dbStore.updateStatus(event.entity.constructor);
        } else if (event.entityId !== null || event.entityId) {
            Object.entries(event.entityId).forEach(([repositoryIdName, id]) => {
                const entity: typeof TagEntity | typeof TaskEntity | typeof SettingEntity | typeof TaskGroupEntity | typeof AppPropEntity = getEntityType(repositoryIdName.replaceAll('Id', ''));
                this.dbStore.updateStatus(entity);
            })
        }

        this.appStore.eventBus.emit(EventType.DB_ALL, event);
        this.appStore.eventBus.emit(EventType.DB_AFTER_SOFT_REMOVE, event);
    }

    afterRecover(event: RecoverEvent<any>): Promise<any> | void {
        if (event.entity !== null && event.entity !== undefined) {
            this.dbStore.updateStatus(event.entity.constructor);
        } else if (event.entityId !== null || event.entityId) {
            Object.entries(event.entityId).forEach(([repositoryIdName, id]) => {
                const entity: typeof TagEntity | typeof TaskEntity | typeof SettingEntity | typeof TaskGroupEntity | typeof AppPropEntity = getEntityType(repositoryIdName.replaceAll('Id', ''));
                this.dbStore.updateStatus(entity);
            })
        }

        this.appStore.eventBus.emit(EventType.DB_ALL, event);
        this.appStore.eventBus.emit(EventType.DB_AFTER_RECOVER, event);
    }

    afterUpdate(event: UpdateEvent<any>): Promise<any> | void {
        this.appStore.eventBus.emit(EventType.DB_ALL, event);
        this.appStore.eventBus.emit(EventType.DB_AFTER_UPDATE, event);
    }

}
