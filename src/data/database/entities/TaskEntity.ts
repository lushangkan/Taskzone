import {
    Column,
    CreateDateColumn,
    Entity, ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    Tree,
    TreeChildren,
    TreeParent
} from "typeorm";
import {RepeatMode} from "@/data/enum/RepeatMode";
import {RepeatCustom} from "@/data/models/RepeatCustom";
import {TaskGroupEntity} from "@/data/database/entities/TaskGroupEntity";
import {ReminderMode} from "@/data/enum/ReminderMode";
import {Priority} from "@/data/enum/Priority";
import {TagEntity} from "@/data/database/entities/TagEntity";

@Entity()
@Tree("closure-table")
export class TaskEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column('text')
    description: string;

    @Column('text')
    color: string;

    @Column('text')
    icon: string;

    @ManyToMany(() => TagEntity, tag => tag.tasks, { nullable: true })
    tags: (TagEntity | null)[];

    @Column('int', { nullable: true })
    priority: Priority | null;

    @CreateDateColumn()
    createDate: Date;

    @Column('datetime', { nullable: true })
    deadLineDate: Date | null;

    @Column('boolean')
    isDone: boolean;

    @Column('int')
    repeatMode: RepeatMode;

    @Column('simple-json', { nullable: true })
    repeatCustom: RepeatCustom | null;

    @Column('int')
    reminders: ReminderMode;

    @ManyToOne(() => TaskGroupEntity, taskGroup => taskGroup.tasks, { nullable: true })
    taskGroup: TaskGroupEntity | null;

    @TreeParent()
    parentTask: TaskEntity | null;

    @TreeChildren()
    childTasks: Map<TaskEntity, any> | boolean | any[];

}
