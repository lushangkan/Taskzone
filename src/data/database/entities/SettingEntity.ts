import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class SettingEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', {unique: true}) // 唯一列
    key: string;

    @Column('text')
    value: NonNullable<unknown>;

}
