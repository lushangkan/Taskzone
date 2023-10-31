import {Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {RepeatMode} from "@/data/enum/RepeatMode";
import {RepeatCustom} from "@/data/models/RepeatCustom";
import {TaskEntity} from "@/data/database/entities/TaskEntity";
import {TagEntity} from "@/data/database/entities/TagEntity";
import {ReminderMode} from "@/data/enum/ReminderMode";
import {Priority} from "@/data/enum/Priority";

@Entity()
export class TaskGroupEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("simple-json", { nullable: true })
    order: { done: string[], undone: string[] } | null;

    @Column('datetime', { nullable: true, unique: true })
    dayTaskDate: Date | null;

    @Column('text', { nullable: true })
    name: string | null;

    @Column('text', { nullable: true })
    description: string | null;

    @OneToMany(() => TaskEntity, task => task.taskGroup, { nullable: true, cascade: true, onDelete: "CASCADE" })
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

    @Column('text', { default: RepeatMode.ONLY_ONCE })
    repeatMode: RepeatMode;

    @Column('simple-json', { nullable: true })
    repeatCustom: RepeatCustom | null;

    @Column('text', { default: ReminderMode.NONE } )
    reminders: ReminderMode;

    @Column('text', { default: Priority.LOW })
    priority: Priority;

}
