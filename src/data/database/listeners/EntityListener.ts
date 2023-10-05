import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent, LoadEvent, RecoverEvent,
    RemoveEvent,
    SoftRemoveEvent, UpdateEvent
} from "typeorm";
import {Promise} from "cypress/types/cy-bluebird";
import {useDatabaseStores} from "@/stores/database-stores";
import {useAppStores} from "@/stores/app-stores";
import EventType from "@/event/EventType";

@EventSubscriber()
export class EntityListener implements EntitySubscriberInterface {

    private dbStore = useDatabaseStores();
    private appStore = useAppStores();

    afterLoad(entity: any, event?: LoadEvent<any>): Promise<any> | void {
        this.appStore.eventBus.emit(EventType.DB_AFTER_LOAD, event);
    }

    afterInsert(event: InsertEvent<any>): Promise<any> | void {
        if (event.entity === undefined) {
            console.warn('event.entity is undefined');
            return;
        }

        const entityType = event.entity.constructor;
        this.dbStore.updateStatus(entityType);

        this.appStore.eventBus.emit(EventType.DB_ALL, event);
        this.appStore.eventBus.emit(EventType.DB_AFTER_INSERT, event);
    }

    afterRemove(event: RemoveEvent<any>): Promise<any> | void {
        if (event.entity === undefined) {
            console.warn('event.entity is undefined');
            return;
        }

        const entityType = event.entity.constructor;
        this.dbStore.updateStatus(entityType);

        this.appStore.eventBus.emit(EventType.DB_ALL, event);
        this.appStore.eventBus.emit(EventType.DB_AFTER_REMOVE, event);
    }

    afterSoftRemove(event: SoftRemoveEvent<any>): Promise<any> | void {
        if (event.entity === undefined) {
            console.warn('event.entity is undefined');
            return;
        }

        const entityType = event.entity.constructor;
        this.dbStore.updateStatus(entityType);

        this.appStore.eventBus.emit(EventType.DB_ALL, event);
        this.appStore.eventBus.emit(EventType.DB_AFTER_SOFT_REMOVE, event);
    }

    afterRecover(event: RecoverEvent<any>): Promise<any> | void {
        if (event.entity === undefined) {
            console.warn('event.entity is undefined');
            return;
        }

        const entityType = event.entity.constructor;
        this.dbStore.updateStatus(entityType);

        this.appStore.eventBus.emit(EventType.DB_ALL, event);
        this.appStore.eventBus.emit(EventType.DB_AFTER_RECOVER, event);
    }

    afterUpdate(event: UpdateEvent<any>): Promise<any> | void {
        this.appStore.eventBus.emit(EventType.DB_ALL, event);
        this.appStore.eventBus.emit(EventType.DB_AFTER_UPDATE, event);
    }

}
