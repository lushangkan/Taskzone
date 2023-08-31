import {useDatabaseStores} from "@/stores/database-stores";
import {Task} from "@/data/database/entities/Task";
import {faker} from '@faker-js/faker';
import * as fun from "@/utils/fun"
import {Priority} from "@/data/enum/Priority";
import {randomEnum, randomRepeatCustom} from "@/utils/fun";
import {RepeatMode} from "@/data/enum/RepeatMode";
import {ReminderMode} from "@/data/enum/ReminderMode";
import {Tag} from "@/data/database/entities/Tag";
import {TaskGroup} from "@/data/database/entities/TaskGroup";

export async function genFakeTask(count: number) {
    const dbStore = useDatabaseStores();
    const entityManager = dbStore.entityManager;

    const map: Map<Task, any> = new Map();

    if (entityManager) {
        for (let i = 0; i < count; i++) {
            const task = new Task();

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
    const map: Map<Tag, any> = new Map();

    if (entityManager) {
        for (let i = 0; i < count; i++) {
            const tag = new Tag();

            tag.name = `Tag ${faker.lorem.word()}`
            tag.description = faker.lorem.lines(1);
            tag.color = fun.randomColor();
            tag.icon = fun.randomEmoji();
            tag.tasks = fun.randomBoolean() ? await getRandomTasks(fun.randomInt(0, 3)) : [];
            tag.taskGroups = fun.randomBoolean() ? await getRandomTaskGroups(fun.randomInt(0, 3)) : [];

            try {
                map.set(await entityManager.save(tag), true);
            } catch (e) {
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
    const map: Map<TaskGroup, any> = new Map();

    if (entityManager) {
        for (let i = 0; i < count; i++) {
            const taskGroup = new TaskGroup();

            taskGroup.name = `TaskGroup ${faker.lorem.word()}`
            taskGroup.description = faker.lorem.lines(1);
            taskGroup.color = fun.randomColor();
            taskGroup.icon = fun.randomEmoji();
            taskGroup.tags = fun.randomBoolean() ? await getRandomTags(fun.randomInt(0, 3)) : [];
            taskGroup.createDate = faker.date.past();
            taskGroup.deadLineDate = faker.date.future();
            taskGroup.repeatMode = randomEnum(RepeatMode);

            if (taskGroup.repeatMode === RepeatMode.CUSTOM) {
                taskGroup.repeatCustom = fun.randomRepeatCustom();
            }

            taskGroup.tasks = fun.randomBoolean() ? await getRandomTasks(fun.randomInt(0, 6)) : [];

            try {
                map.set(await entityManager.save(taskGroup), true);
            } catch (e) {
                map.set(taskGroup, e);
            }
        }
        return map;
    }
    return false;
}

export async function getRandomTag(): Promise<Tag | null> {
    const dbStore = useDatabaseStores();
    const entityManager = dbStore.entityManager;

    if (entityManager) {
        try {
            const tags = await entityManager.getRepository(Tag).find();
            return tags[fun.getRandomElements(tags)];
        } catch (e) {
            console.error(e);
        }
        return null;
    }
    return null;
}

export async function getRandomTaskGroup(): Promise<TaskGroup | null> {
    const dbStore = useDatabaseStores();
    const entityManager = dbStore.entityManager;

    if (entityManager) {
        try {
            const taskGroups = await entityManager.getRepository(TaskGroup).find();
            return taskGroups[fun.getRandomElements(taskGroups)];
        } catch (e) {
            console.error(e);
        }
        return null;
    }
    return null;
}

export async function getRandomTask(): Promise<Task | null> {
    const dbStore = useDatabaseStores();
    const entityManager = dbStore.entityManager;

    if (entityManager) {
        try {
            const tasks = await entityManager.getRepository(Task).find();
            return tasks[fun.getRandomElements(tasks)];
        } catch (e) {
            console.error(e);
        }
        return null;
    }
    return null;
}


export async function getRandomTags(count: number) : Promise<(Tag | null)[]> {
    const tags: (Tag | null)[] = [];
    for (let i = 0; i < count; i++) {
        tags.push(await getRandomTag());
    }
    return tags;
}

export async function getRandomTaskGroups(count: number) : Promise<(TaskGroup | null)[]> {
    const taskGroups: (TaskGroup | null)[] = [];
    for (let i = 0; i < count; i++) {
        taskGroups.push(await getRandomTaskGroup());
    }
    return taskGroups;
}

export async function getRandomTasks(count: number) : Promise<(Task | null)[]> {
    const tasks: (Task | null)[] = [];
    for (let i = 0; i < count; i++) {
        tasks.push(await getRandomTask());
    }
    return tasks;
}
