import {Setting} from "@/data/interface/Setting";

export class DefSetting implements Setting{
    resetTime: Date = new Date('2021-01-01T00:00:00.000Z');
    theme = 'default';
}
