import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Task} from "@/data/database/entities/Task";
import {TaskGroup} from "@/data/database/entities/TaskGroup";

@Entity()
export class Tag {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column('text')
    color: string;

    @Column('text')
    icon: string;

    @Column('text')
    description: string;

    @ManyToMany(() => Task, task => task.tags, { nullable: true })
    @JoinTable()
    tasks: (Task | null)[];

    @ManyToMany(() => TaskGroup, taskGroup => taskGroup.tags, { nullable: true })
    @JoinTable()
    taskGroups: (TaskGroup | null)[];

}
