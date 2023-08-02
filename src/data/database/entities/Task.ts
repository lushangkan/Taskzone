import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Task {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text')
    name: string;

    @Column('text')
    description: string;

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

    @Column('boolean')
    isDone: boolean;

    @Column('datetime')
    doneDate: Date;
}