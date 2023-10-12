enum EventType {
    MAIN_SCROLL_INITIALIZED_EVENT = 'mainScrollInitialized',

    // Task card
    ENABLED_TASK_CARD_MULTI_SELECTION_MODE_EVENT = 'enabledTaskCardMultiSelectionMode',
    DISABLED_TASK_CARD_MULTI_SELECTION_MODE_EVENT = 'disabledTaskCardMultiSelectionMode',

    DRAGGING_TASK_CARD_EVENT = 'draggingTaskCard',
    DRAG_TASK_CARD_END_EVENT = 'draggingTaskCardEnd',

    // Task group card
    ENABLED_TASK_GROUP_CARD_MULTI_SELECTION_MODE_EVENT = 'enabledTaskGroupCardMultiSelectionMode',
    DISABLED_TASK_GROUP_CARD_MULTI_SELECTION_MODE_EVENT = 'disabledTaskGroupCardMultiSelectionMode',

    DRAGGING_TASK_GROUP_CARD_EVENT = 'draggingTaskGroupCard',
    DRAG_TASK_GROUP_CARD_END_EVENT = 'draggingTaskGroupCardEnd',

    CLICK_DELETE_TASK_BUTTON_EVENT = 'clickDeleteTaskButton',
    CLICK_EDIT_TASK_BUTTON_EVENT = 'clickEditTaskButton',
    CLICK_MOVE_TASK_BUTTON_EVENT = 'clickMoveTaskButton',
    CLICK_COPY_TASK_BUTTON_EVENT = 'clickCopyTaskButton',

    DB_ALL = 'dbAll',
    DB_AFTER_LOAD = 'dbAfterLoad',
    DB_AFTER_INSERT = 'dbAfterInsert',
    DB_AFTER_UPDATE = 'dbAfterUpdate',
    DB_AFTER_REMOVE = 'dbAfterRemove',
    DB_AFTER_SOFT_REMOVE = 'dbAfterSoftRemove',
    DB_AFTER_RECOVER = 'dbAfterRecover'
}

export default EventType;
