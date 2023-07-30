import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm";
import {RepeatCustom} from "@/data/models/RepeatCustom";
import {RepeatMode} from "../../enum/RepeatMode";

@Entity()
export class DayTask {

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
    createDate!: Date;

    @Column('datetime')
    deadLineDate: Date;

    @Column('simple-array')
    doneDate: Date[];

    @Column('int')
    repeatMode: RepeatMode;

    @Column('simple-json')
    repeatCustom: RepeatCustom;
}