import {TaskEntity} from "@/data/database/entities/TaskEntity";
import * as fun from "@/utils/fun";
import {Priority} from "@/data/enum/Priority";
import {faker} from '@faker-js/faker';
import {RepeatMode} from "@/data/enum/RepeatMode";
import {ReminderMode} from "@/data/enum/ReminderMode";
import * as GenFakeData from "@/data/database/utils/gen-fake-data";
import {TagEntity} from "@/data/database/entities/TagEntity";

/**
 * 获取默认任务 (测试使用)
 */
export function getTestTask() {
    const task = new TaskEntity();
    task.id = crypto.randomUUID();
    task.name = "任务";
    task.description = "介绍";
    task.color = fun.randomColorFromOpenColor([4, 5, 6]);
    task.icon = "🪵";
    task.tags = [getTestTag(), getTestTag(), getTestTag()];
    task.priority = Priority.MEDIUM;
    task.createDate = faker.date.past();
    task.deadLineDate = faker.date.future();
    task.isDone = false;
    task.repeatMode = RepeatMode.ONLY_ONE;
    task.repeatCustom = null;
    task.reminders = ReminderMode.VIBRATION_RINGTONE_NOTIFICATION;
    task.taskGroup = null;
    task.parentTask = null;
    task.childTasks = [];
    return task;
}

export function getTestTag() {
    const tag = new TagEntity();

    tag.id = crypto.randomUUID();
    tag.name = "标签";
    tag.color = fun.randomColorFromOpenColor([4, 5, 6]);
    tag.icon = '🍪'
    tag.description = "介绍";
    tag.tasks = [];
    tag.taskGroups = [];

    return tag;
}
