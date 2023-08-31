import {DataSource} from 'typeorm';
import dBConnect from "../db-connect";
import {SettingEntity} from "@/data/database/entities/SettingEntity";
import {TaskGroupEntity} from "@/data/database/entities/TaskGroupEntity";
import {TaskEntity} from "@/data/database/entities/TaskEntity";
import {TagEntity} from "@/data/database/entities/TagEntity";

export default new DataSource({
    type: 'capacitor',
    driver: dBConnect,
    database: 'taskzoneDB',
    entities: [SettingEntity, TaskEntity, TaskGroupEntity, TagEntity],
    logging: ['error', 'query', 'schema'],
    //TODO: 数据库结构完成时设为false
    synchronize: true,
    //TODO: 加密
    mode: "encryption",
});
