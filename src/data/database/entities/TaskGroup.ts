import {Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {RepeatMode} from "@/data/enum/RepeatMode";
import {RepeatCustom} from "@/data/models/RepeatCustom";
import {Task} from "@/data/database/entities/Task";
import {Tag} from "@/data/database/entities/Tag";

@Entity()
export class TaskGroup {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('datetime', { nullable: true })
    dayTaskDate: Date | null;

    @Column('text')
    name: string;

    @Column('text')
    description: string;

    @OneToMany(() => Task, task => task.taskGroup, { nullable: true })
    tasks: (Task | null)[];

    @Column('text')
    color: string;

    @Column('text')
    icon: string;

    @ManyToMany(() => Tag, tag => tag.taskGroups, { nullable: true })
    tags: (Tag | null)[];

    @CreateDateColumn()
    createDate: Date;

    @Column('datetime', { nullable: true })
    deadLineDate: Date;

    @Column('int')
    repeatMode: RepeatMode;

    @Column('simple-json', { nullable: true })
    repeatCustom: RepeatCustom | null;

}
