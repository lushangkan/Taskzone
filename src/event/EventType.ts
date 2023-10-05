enum EventType {
    MAIN_SCROLL_INITIALIZED_EVENT = 'mainScrollInitialized',

    DB_ALL = 'dbAll',
    DB_AFTER_LOAD = 'dbAfterLoad',
    DB_AFTER_INSERT = 'dbAfterInsert',
    DB_AFTER_UPDATE = 'dbAfterUpdate',
    DB_AFTER_REMOVE = 'dbAfterRemove',
    DB_AFTER_SOFT_REMOVE = 'dbAfterSoftRemove',
    DB_AFTER_RECOVER = 'dbAfterRecover'
}

export default EventType;
