import {TaskEntity} from "@/data/database/entities/TaskEntity";
import * as fun from "@/utils/fun";

export function getDefaultTask() { // TODO
    return {
        id: crypto.randomUUID(),
        name: "任务",
        description: "介绍",
        color: fun.randomColor(),
        icon: "🪵",
    } as TaskEntity;
}
