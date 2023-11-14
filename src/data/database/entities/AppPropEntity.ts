import {Column} from "typeorm";

export class AppPropEntity {

    @Column('text')
    key: string;

    @Column('simple-json')
    value: any | undefined;

}
