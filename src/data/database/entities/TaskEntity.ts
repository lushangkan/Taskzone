import {
    Column,
    CreateDateColumn,
    Entity, JoinTable, ManyToMany,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import {RepeatMode} from "@/data/enum/RepeatMode";
import {RepeatCustom} from "@/data/models/RepeatCustom";
import {TaskGroupEntity} from "@/data/database/entities/TaskGroupEntity";
import {ReminderMode} from "@/data/enum/ReminderMode";
import {Priority} from "@/data/enum/Priority";
import {TagEntity} from "@/data/database/entities/TagEntity";

@Entity()
export class TaskEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column('datetime', { nullable: true })
    dayTaskDay: Date | null;

    @Column('text')
    name: string;

    @Column('text')
    description: string;

    @Column('text')
    color: string;

    @Column('text')
    icon: string;

    @ManyToMany(() => TagEntity, tag => tag.tasks, { nullable: true })
    @JoinTable()
    tags: (TagEntity | null)[];

    @Column('text', { nullable: true })
    priority: Priority | null;

    @CreateDateColumn()
    createDate: Date;

    @Column('datetime', { nullable: true })
    deadLineDate: Date | null;

    @Column('boolean')
    isDone: boolean;

    @Column('text')
    repeatMode: RepeatMode;

    @Column('simple-json', { nullable: true })
    repeatCustom: RepeatCustom | null;

    @Column('text')
    reminders: ReminderMode;

    @ManyToOne(() => TaskGroupEntity, taskGroup => taskGroup.tasks, { nullable: true })
    taskGroup: TaskGroupEntity | null;

    @ManyToOne(() => TaskEntity, task => task.childTasks, { nullable: true })
    parentTask: TaskEntity | null;

    @OneToMany(() => TaskEntity, task => task.parentTask, { nullable: true })
    childTasks: TaskEntity[] | null[];

}
