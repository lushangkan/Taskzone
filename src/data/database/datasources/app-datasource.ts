import {DataSource} from 'typeorm';
import dBConnect from "../db-connect";
import {DayTask} from "@/data/database/entities/DayTask";
import {Setting} from "@/data/database/entities/Setting";
import {TaskGroup} from "@/data/database/entities/TaskGroup";
import {Task} from "@/data/database/entities/Task";

export default new DataSource({
    type: 'capacitor',
    driver: dBConnect,
    database: 'taskzoneDB',
    entities: [DayTask, Setting, Task, TaskGroup],
    logging: ['error', 'query', 'schema'],
    //TODO: 数据库结构完成时设为false
    synchronize: true,
    //TODO: 加密
    mode: "encryption",
});