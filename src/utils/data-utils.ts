import {TaskEntity} from "@/data/database/entities/TaskEntity";
import * as fun from "@/utils/fun";
import {Priority} from "@/data/enum/Priority";
import {faker} from '@faker-js/faker';
import {RepeatMode} from "@/data/enum/RepeatMode";
import {ReminderMode} from "@/data/enum/ReminderMode";

/**
 * 获取默认任务 (测试使用)
 */
export function getDefaultTask() {
    const task = new TaskEntity();
    task.id = crypto.randomUUID();
    task.name = "任务";
    task.description = "介绍";
    task.color = '#ffd43b';
    task.icon = "🪵";
    task.tags = [];
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

