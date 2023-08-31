import {DataSource} from 'typeorm';
import dBConnect from "../db-connect";
import {Setting} from "@/data/database/entities/Setting";
import {TaskGroup} from "@/data/database/entities/TaskGroup";
import {Task} from "@/data/database/entities/Task";
import {Tag} from "@/data/database/entities/Tag";

export default new DataSource({
    type: 'capacitor',
    driver: dBConnect,
    database: 'taskzoneDB',
    entities: [Setting, Task, TaskGroup, Tag],
    logging: ['error', 'query', 'schema'],
    //TODO: 数据库结构完成时设为false
    synchronize: true,
    //TODO: 加密
    mode: "encryption",
});
