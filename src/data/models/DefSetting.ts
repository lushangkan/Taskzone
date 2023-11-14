import {Settings} from "@/data/interface/Settings";

export class DefSetting implements Settings{
    resetTime: Date = new Date('00:00:00');
    theme = 'default';
}
