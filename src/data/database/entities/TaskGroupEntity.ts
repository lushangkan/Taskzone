import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import {RepeatMode} from "@/data/enum/RepeatMode";
import {RepeatCustom} from "@/data/models/RepeatCustom";
import {TaskEntity} from "@/data/database/entities/TaskEntity";
import {TagEntity} from "@/data/database/entities/TagEntity";

@Entity()
export class TaskGroupEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column('datetime', { nullable: true })
    dayTaskDate: Date | null;

    @Column('text', { nullable: true })
    name: string | null;

    @Column('text', { nullable: true })
    description: string | null;

    @OneToMany(() => TaskEntity, task => task.taskGroup, { nullable: true, cascade: true })
    tasks: (TaskEntity | null)[];

    @Column('text', { nullable: true })
    color: string | null;

    @Column('text', { nullable: true })
    icon: string | null;

    @ManyToMany(() => TagEntity, tag => tag.taskGroups, { nullable: true })
    @JoinTable()
    tags: (TagEntity | null)[];

    @CreateDateColumn()
    createDate: Date;

    @Column('datetime', { nullable: true })
    deadLineDate: Date | null;

    @Column('text')
    repeatMode: RepeatMode;

    @Column('simple-json', { nullable: true })
    repeatCustom: RepeatCustom | null;

}
