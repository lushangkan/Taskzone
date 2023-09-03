import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent, RecoverEvent,
    RemoveEvent,
    SoftRemoveEvent
} from "typeorm";
import {Promise} from "cypress/types/cy-bluebird";
import {useDatabaseStores} from "@/stores/database-stores";

@EventSubscriber()
export class EntityListener implements EntitySubscriberInterface {

    private dbStore = useDatabaseStores();

    afterInsert(event: InsertEvent<any>): Promise<any> | void {
        if (event.entity === undefined) {
            console.warn('event.entity is undefined');
            return;
        }

        const entityType = event.entity.constructor;
        this.dbStore.updateStatus(entityType);
    }

    afterRemove(event: RemoveEvent<any>): Promise<any> | void {
        if (event.entity === undefined) {
            console.warn('event.entity is undefined');
            return;
        }

        const entityType = event.entity.constructor;
        this.dbStore.updateStatus(entityType);
    }

    afterSoftRemove(event: SoftRemoveEvent<any>): Promise<any> | void {
        if (event.entity === undefined) {
            console.warn('event.entity is undefined');
            return;
        }

        const entityType = event.entity.constructor;
        this.dbStore.updateStatus(entityType);
    }

    afterRecover(event: RecoverEvent<any>): Promise<any> | void {
        if (event.entity === undefined) {
            console.warn('event.entity is undefined');
            return;
        }

        const entityType = event.entity.constructor;
        this.dbStore.updateStatus(entityType);
    }

}
