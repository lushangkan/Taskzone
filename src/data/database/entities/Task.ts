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
import {TaskGroup} from "@/data/database/entities/TaskGroup";
import {ReminderMode} from "@/data/enum/ReminderMode";
import {Priority} from "@/data/enum/Priority";
import {Tag} from "@/data/database/entities/Tag";

@Entity()
@Tree("closure-table")
export class Task {

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

    @ManyToMany(() => Tag, tag => tag.tasks, { nullable: true })
    tags: (Tag | null)[];

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

    @ManyToOne(() => TaskGroup, taskGroup => taskGroup.tasks, { nullable: true })
    taskGroup: TaskGroup | null;

    @TreeParent()
    parentTask: Task | null;

    @TreeChildren()
    childTasks: Map<Task, any> | boolean | any[];

}
