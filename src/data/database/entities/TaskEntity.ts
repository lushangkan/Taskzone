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

    @Column('text', { default: Priority.LOW })
    priority: Priority;

    @CreateDateColumn()
    createDate: Date;

    @Column('datetime', { nullable: true })
    deadLineDate: Date | null;

    @Column('boolean')
    isDone: boolean;

    @Column('text', { default: RepeatMode.ONLY_ONCE })
    repeatMode: RepeatMode;

    @Column('simple-json', { nullable: true })
    repeatCustom: RepeatCustom | null;

    @Column('text', { default: ReminderMode.NONE })
    reminders: ReminderMode;

    @ManyToOne(() => TaskGroupEntity, taskGroup => taskGroup.tasks, { nullable: true,  onDelete: "CASCADE" })
    taskGroup: TaskGroupEntity | null;

    @ManyToOne(() => TaskEntity, task => task.childTasks, { nullable: true })
    parentTask: TaskEntity | null;

    @OneToMany(() => TaskEntity, task => task.parentTask, { nullable: true, onDelete: "CASCADE" })
    childTasks: TaskEntity[] | null[];

}
