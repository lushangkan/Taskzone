import {useDatabaseStores} from "@/stores/database-stores";
import {TaskEntity} from "@/data/database/entities/TaskEntity";
import {faker} from '@faker-js/faker';
import * as fun from "@/utils/fun"
import {Priority} from "@/data/enum/Priority";
import {randomEnum} from "@/utils/fun";
import {RepeatMode} from "@/data/enum/RepeatMode";
import {ReminderMode} from "@/data/enum/ReminderMode";
import {TagEntity} from "@/data/database/entities/TagEntity";
import {TaskGroupEntity} from "@/data/database/entities/TaskGroupEntity";

export async function genFakeTask(count: number) {
    const dbStore = useDatabaseStores();
    const entityManager = dbStore.entityManager;

    const map: Map<TaskEntity, any> = new Map();

    if (entityManager) {
        for (let i = 0; i < count; i++) {
            const task = new TaskEntity();

            task.name = `Task ${faker.lorem.word()}`
            task.description = faker.lorem.lines(1);
            task.color = fun.randomColor();
            task.icon = fun.randomEmoji();
            task.tags = fun.randomBoolean() ? await getRandomTags(fun.randomInt(1, 3)) : [];
            task.priority = randomEnum(Priority);
            task.createDate = faker.date.past();
            task.deadLineDate = faker.date.future();
            task.isDone = faker.datatype.boolean();
            task.repeatMode = randomEnum(RepeatMode);
            task.repeatCustom = null;

            if (task.repeatMode === RepeatMode.CUSTOM) {
                task.repeatCustom = fun.randomRepeatCustom();
            }

            task.reminders = randomEnum(ReminderMode);
            task.taskGroup = fun.randomBoolean() ? await getRandomTaskGroup() : null;
            task.parentTask = fun.randomBoolean() ? await getRandomTask() : null;
            task.childTasks = fun.randomBoolean() ? await genFakeTask(fun.randomInt(0, 3)) : [];

            try {
                map.set(await entityManager.save(task), true);
            } catch (e) {
                console.error(e);
                map.set(task, e);
            }

        }
        return map;
    }
    return false;
}


export async function genFakeTag(count: number) {
    const dbStore = useDatabaseStores();
    const entityManager = dbStore.entityManager;
    const map: Map<TagEntity, any> = new Map();

    if (entityManager) {
        for (let i = 0; i < count; i++) {
            const tag = new TagEntity();

            tag.name = `Tag ${faker.lorem.word()}`
            tag.description = faker.lorem.lines(1);
            tag.color = fun.randomColor();
            tag.icon = fun.randomEmoji();
            tag.tasks = fun.randomBoolean() ? await getRandomTasks(fun.randomInt(0, 3)) : [];
            tag.taskGroups = fun.randomBoolean() ? await getRandomTaskGroups(fun.randomInt(0, 3)) : [];

            try {
                map.set(await entityManager.save(tag), true);
            } catch (e) {
                console.error(e);
                map.set(tag, e);
            }
        }
        return map;
    }
    return false;
}

export async function genFakeTaskGroup(count: number) {
    const dbStore = useDatabaseStores();
    const entityManager = dbStore.entityManager;
    const map: Map<TaskGroupEntity, any> = new Map();

    if (entityManager) {
        for (let i = 0; i < count; i++) {
            const taskGroup = new TaskGroupEntity();

            taskGroup.name = `TaskGroup ${faker.lorem.word()}`
            taskGroup.dayTaskDate = fun.randomBoolean() ? faker.date.past() : null;
            taskGroup.description = faker.lorem.lines(1);
            taskGroup.color = fun.randomColor();
            taskGroup.icon = fun.randomEmoji();
            taskGroup.tags = fun.randomBoolean() ? await getRandomTags(fun.randomInt(0, 3)) : [];
            taskGroup.createDate = faker.date.past();
            taskGroup.deadLineDate = faker.date.future();
            taskGroup.repeatMode = randomEnum(RepeatMode);
            taskGroup.repeatCustom = null;

            if (taskGroup.repeatMode === RepeatMode.CUSTOM) {
                taskGroup.repeatCustom = fun.randomRepeatCustom();
            }

            taskGroup.tasks = fun.randomBoolean() ? await getRandomTasks(fun.randomInt(0, 6)) : [];

            try {
                map.set(await entityManager.save(taskGroup), true);
            } catch (e) {
                console.error(e);
                map.set(taskGroup, e);
            }
        }
        return map;
    }
    return false;
}

export async function getRandomTag(): Promise<TagEntity | null> {
    const dbStore = useDatabaseStores();
    const entityManager = dbStore.entityManager;

    if (entityManager) {
        try {
            const tags = await entityManager.getRepository(TagEntity).find();
            return tags[fun.getRandomElements(tags)];
        } catch (e) {
            console.error(e);
        }
        return null;
    }
    return null;
}

export async function getRandomTaskGroup(loadHasTasks?: boolean): Promise<TaskGroupEntity | null> {
    loadHasTasks === undefined ? loadHasTasks = false : null;
    const dbStore = useDatabaseStores();
    const entityManager = dbStore.entityManager;

    if (entityManager) {
        try {
            const taskGroups = await entityManager.getRepository(TaskGroupEntity).find({
                relations: {
                    tasks: true,
                }
            });
            if (taskGroups.length === 0) {
                return null;
            }
            let taskGroup = null;
            if (!loadHasTasks) {
                let retry = true;
                while (retry) {
                    const r = taskGroups[fun.getRandomElements(taskGroups)];
                    if (r.tasks === undefined || r.tasks === null || r.tasks.length === 0) {
                        taskGroup = r;
                        retry = false;
                    }
                }
            } else {
                taskGroup = taskGroups[fun.getRandomElements(taskGroups)];
            }
            return taskGroup;
        } catch (e) {
            console.error(e);
        }
        return null;
    }
    return null;
}

export async function getRandomTask(loadHasTaskGroup?: boolean): Promise<TaskEntity | null> {
    loadHasTaskGroup === undefined ? loadHasTaskGroup = false : null;
    const dbStore = useDatabaseStores();
    const entityManager = dbStore.entityManager;

    if (entityManager) {
        try {
            const tasks = await entityManager.getRepository(TaskEntity).find({
                relations: {
                    taskGroup: true,
                }
            });
            if (tasks.length === 0) {
                return null;
            }
            let task = null;
            if (!loadHasTaskGroup) {
                let retry = true;
                while (retry) {
                    const r = tasks[fun.getRandomElements(tasks)];
                    if (r.taskGroup === undefined || r.taskGroup === null) {
                        task = r;
                        retry = false;
                    }
                }
            } else {
                task = tasks[fun.getRandomElements(tasks)];
            }

            return task;
        } catch (e) {
            console.error(e);
        }
        return null;
    }
    return null;
}


export async function getRandomTags(count: number) : Promise<(TagEntity | null)[]> {
    const tags: (TagEntity | null)[] = [];
    for (let i = 0; i < count; i++) {
        let retryTimes = 0;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            if (retryTimes > 10) {
                break;
            }
            const tag = await getRandomTag();
            if ( tag === undefined || tag === null || tags.find((e) => e !== undefined? e?.id === tag?.id : true)) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                retryTimes++;
                continue;
            }
            tags.push(tag);
            break;
        }
    }
    return tags;
}

export async function getRandomTaskGroups(count: number) : Promise<(TaskGroupEntity | null)[]> {
    const taskGroups: (TaskGroupEntity | null)[] = [];
    for (let i = 0; i < count; i++) {
        let retryTimes = 0;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            if (retryTimes > 10) {
                break;
            }
            const taskGroup = await getRandomTaskGroup();
            if ( taskGroup === undefined || taskGroup === null || taskGroups.find((e) => e !== undefined? e?.id === taskGroup?.id : true)) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                retryTimes++;
                continue;
            }
            taskGroups.push(taskGroup);
            break;
        }
    }
    return taskGroups;
}

export async function getRandomTasks(count: number) : Promise<(TaskEntity | null)[]> {
    const tasks: (TaskEntity | null)[] = [];
    for (let i = 0; i < count; i++) {
        let retryTimes = 0;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            if (retryTimes > 10) {
                break;
            }
            const task = await getRandomTask();
            if (task === undefined || task === null || tasks.find((e) => e !== undefined? e?.id === task?.id : true)) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                retryTimes++;
                continue;
            }
            tasks.push(task);
            break;
        }
    }
    return tasks;
}
