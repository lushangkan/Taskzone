import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {TaskEntity} from "@/data/database/entities/TaskEntity";
import {TaskGroupEntity} from "@/data/database/entities/TaskGroupEntity";

@Entity()
export class TagEntity {

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

    @ManyToMany(() => TaskEntity, task => task.tags, { nullable: true })
    @JoinTable()
    tasks: (TaskEntity | null)[];

    @ManyToMany(() => TaskGroupEntity, taskGroup => taskGroup.tags, { nullable: true })
    @JoinTable()
    taskGroups: (TaskGroupEntity | null)[];

}
