import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm";

@Entity()
export class TaskGroup {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text')
    name: string;

    @Column('text')
    description: string;

    @Column('simple-array')
    tasks: number[];

    @Column('text')
    color: string;

    @Column('text')
    icon: string;

    @Column('simple-array')
    tags: number[];

    @CreateDateColumn()
    createDate: Date;

    @Column('datetime')
    deadLineDate: Date;

}