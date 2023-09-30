import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent, LoadEvent, RecoverEvent,
    RemoveEvent,
    SoftRemoveEvent, UpdateEvent
} from "typeorm";
import {Promise} from "cypress/types/cy-bluebird";
import {useDatabaseStores} from "@/stores/database-stores";
import {EventEnum} from "@/data/enum/EventEnum";

@EventSubscriber()
export class EntityListener implements EntitySubscriberInterface {

    private dbStore = useDatabaseStores();

    afterLoad(entity: any, event?: LoadEvent<any>): Promise<any> | void {
        Object.entries(this.dbStore.entityListeners).filter(([key,]) => key === EventEnum.AFTER_LOAD || key === EventEnum.ALL).forEach(([, fun]) => {
            fun(event);
        });
    }

    afterInsert(event: InsertEvent<any>): Promise<any> | void {
        if (event.entity === undefined) {
            console.warn('event.entity is undefined');
            return;
        }

        const entityType = event.entity.constructor;
        this.dbStore.updateStatus(entityType);

        Object.entries(this.dbStore.entityListeners).filter(([key,]) => key === EventEnum.AFTER_INSERT || key === EventEnum.ALL).forEach(([, fun]) => {
            fun(event);
        });
    }

    afterRemove(event: RemoveEvent<any>): Promise<any> | void {
        if (event.entity === undefined) {
            console.warn('event.entity is undefined');
            return;
        }

        const entityType = event.entity.constructor;
        this.dbStore.updateStatus(entityType);

        Object.entries(this.dbStore.entityListeners).filter(([key,]) => key === EventEnum.AFTER_REMOVE || key === EventEnum.ALL).forEach(([, fun]) => {
            fun(event);
        });
    }

    afterSoftRemove(event: SoftRemoveEvent<any>): Promise<any> | void {
        if (event.entity === undefined) {
            console.warn('event.entity is undefined');
            return;
        }

        const entityType = event.entity.constructor;
        this.dbStore.updateStatus(entityType);

        Object.entries(this.dbStore.entityListeners).filter(([key,]) => key === EventEnum.AFTER_SOFT_REMOVE || key === EventEnum.ALL).forEach(([, fun]) => {
            fun(event);
        });
    }

    afterRecover(event: RecoverEvent<any>): Promise<any> | void {
        if (event.entity === undefined) {
            console.warn('event.entity is undefined');
            return;
        }

        const entityType = event.entity.constructor;
        this.dbStore.updateStatus(entityType);

        Object.entries(this.dbStore.entityListeners).filter(([key,]) => key === EventEnum.AFTER_RECOVER || key === EventEnum.ALL).forEach(([, fun]) => {
            fun(event);
        });
    }

    afterUpdate(event: UpdateEvent<any>): Promise<any> | void {
        Object.entries(this.dbStore.entityListeners).filter(([key,]) => key === EventEnum.AFTER_UPDATE || key === EventEnum.ALL).forEach(([, fun]) => {
            fun(event);
        });
    }

}
