import {checkSettingTableIsIntact} from "@/data/database/utils/database-utils";

export async function initSetting() {
    const result = await checkSettingTableIsIntact();
}
