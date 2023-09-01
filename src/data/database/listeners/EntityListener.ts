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

    afterInsert(event: InsertEvent<any>): Promise<any> | void {
        if (event.entity === undefined) {
            console.warn('event.entity is undefined');
            return;
        }

        const entityType = event.entity.constructor;
        useDatabaseStores().updateStatus(entityType);
    }

    afterRemove(event: RemoveEvent<any>): Promise<any> | void {
        if (event.entity === undefined) {
            console.warn('event.entity is undefined');
            return;
        }

        const entityType = event.entity.constructor;
        useDatabaseStores().updateStatus(entityType);
    }

    afterSoftRemove(event: SoftRemoveEvent<any>): Promise<any> | void {
        if (event.entity === undefined) {
            console.warn('event.entity is undefined');
            return;
        }

        const entityType = event.entity.constructor;
        useDatabaseStores().updateStatus(entityType);
    }

    afterRecover(event: RecoverEvent<any>): Promise<any> | void {
        if (event.entity === undefined) {
            console.warn('event.entity is undefined');
            return;
        }

        const entityType = event.entity.constructor;
        useDatabaseStores().updateStatus(entityType);
    }
}
