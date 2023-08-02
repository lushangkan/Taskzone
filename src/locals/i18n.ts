import {createI18n} from "vue-i18n";
import {langEn} from "./language/lang-en";
import {langZhCn} from "./language/lang-zhcn";

export const i18n = createI18n({
    locale: 'zh-cn', // set locale
    fallbackLocale: 'en', // set fallback locale
    messages: {
        en: langEn,
        "zh-cn": langZhCn
    }
})