import {isEmojiSupported} from "is-emoji-supported";
import EmojiCss from '@/assets/styles/fonts/emoji.less?inline'
import Color from "colorjs.io";
import Emojis from "@/assets/data/emojis.json"
import OpenColor from "open-color";
import {RepeatCustom} from "@/data/models/RepeatCustom";
import {faker} from "@faker-js/faker";
import moment from "moment";
import {useI18n} from "vue-i18n";
import "moment/dist/locale/zh-cn.js";

/**
 * 检测设备是否支持emoji v15
 * @param store app store
 */
export function checkIsSupportEmoji(store: any) {
    if (store.isSupportEmoji === undefined) {
        store.isSupportEmoji = isEmojiSupported("🪿");
    }

    if (store.isSupportEmoji === false) {
        const styleEle: HTMLStyleElement = document.createElement("style");
        styleEle.innerHTML = EmojiCss;
    }

    return store.isSupportEmoji;
}

/**
 * 判断元素是否是指定元素的子元素
 * @param child 子元素
 * @param parent 父元素
 */
export function isChildOf(child: HTMLElement, parent: HTMLElement) {
    let parentNode = child.parentNode;
    while (parentNode !== null) {
        if (parentNode === parent) {
            return true;
        }
        parentNode = parentNode.parentNode;
    }
    return false;
}

/**
 * 根据背景色获取前景颜色
 * @param backgroundColorText 背景色
 * @return 文本颜色, css变量名
 */
export function getForegroundColor(backgroundColorText: string) {
    const backgroundColor = new Color(backgroundColorText);

    const base100 = new Color(`hsl(${getCssVar('--b1')})`);

    const contrastBase100 = backgroundColor.contrast(base100, "APCA");

    return contrastBase100  < -40? '--b1' : '--n';
}

/**
 * 判断颜色是否为白色
 * @param color 颜色
 */
export function isWhite(color: string) {
    return new Color(color).lch.l > 90;
}

/**
 * 获取白黑对应的css变量
 */
export function getWhiteBlackCssVar() {
    const base100 = new Color(`hsl(${getCssVar('--b1')})`);
    const neutral = new Color(`hsl(${getCssVar('--n')})`);

    return {
        white: base100.lch.l > neutral.lch.l ? '--b1' : '--n',
        black: base100.lch.l > neutral.lch.l ? '--n' : '--b1'
    }
}

/**
 * 获取css变量
 * @param name 变量名
 */
export function getCssVar(name: string) {
    return getComputedStyle(document.documentElement).getPropertyValue(name);
}

/**
 * 生成随机颜色
 */
export function randomColor() {
    const h = Math.floor(Math.random() * 360);
    const s = 100;
    const l = Math.floor(Math.random()*(85-60+1))+60;
    return new Color('hsl', [h, s, l]).to('srgb').toString({format: "hex"});
}

/**
 * 转换vw为px
 * @param vw vw
 */
export function getPxfromVw(vw: number | undefined) {
    if (vw === undefined) return 0;
    return vw / 100 * window.innerWidth;
}

/**
 * Convert unicode to native emoji
 *
 * @param unicode - emoji unicode
 * @author form https://github.com/delowardev/vue3-emoji-picker
 */
export function unicodeToEmoji(unicode: string) {
    return unicode
        .split('-')
        .map((hex) => parseInt(hex, 16))
        .map((hex) => String.fromCodePoint(hex))
        .join('')
}

/**
 * 从变量中随机获取一个元素
 * @param e 数组,对象
 */
export function getRandomElements(e: any) {
    return Math.floor(Math.random() * (e.length - 1));
}

/**
 * 随机生成emoji
 * @param groups 生成emoji的分组
 */
export function randomEmoji(groups?: string[]) {
    groups = groups === undefined? ['activity', 'travel', 'objects']: groups;
    const emojiJson = JSON.parse(JSON.stringify(Emojis));
    for (const group_name of Object.keys(emojiJson)) {
        if (groups.indexOf(group_name) === -1) {
            delete emojiJson[group_name];
        }
    }
    const groupName = Object.keys(emojiJson)[getRandomElements(Object.keys(emojiJson))];
    const group = emojiJson[groupName];
    const emojiObj = group[getRandomElements(Object.keys(group))];
    return unicodeToEmoji(emojiObj['u']);
}

/**
 * 从OpenColor随机生成color
 */
export function randomColorFromOpenColor(colorCode?: Array<number>) {
    colorCode = colorCode === undefined? [3,4,5,6]: colorCode;
    const entries = Object.entries(OpenColor).filter((name) => {
        return name[0] !== 'white' && name[0] !== 'black';
    });
    return entries[getRandomElements(entries)][1][colorCode[getRandomElements(colorCode)]];
}

/**
 * 随机生成Enum中的元素
 * @param e Enum
 */
export function randomEnum(e: any) {
    const keys = Object.keys(e);
    return e[keys[getRandomElements(keys)]];
}

export function randomRepeatCustom() {
    const custom = new RepeatCustom();
    custom.monday = faker.datatype.boolean();
    custom.tuesday = faker.datatype.boolean();
    custom.wednesday = faker.datatype.boolean();
    custom.thursday = faker.datatype.boolean();
    custom.friday = faker.datatype.boolean();
    custom.saturday = faker.datatype.boolean();
    custom.sunday = faker.datatype.boolean();
    return custom;
}

/**
 * 随机生成boolean
 * @param p 概率
 */
export function randomBoolean(p?: number | undefined): boolean {
    p = p === undefined? 0.5: p;
    if (p < 0 || p > 1) {
        throw new Error("Invalid probability");
    }
    const r = Math.random();
    return r < p;
}

/**
 * 获取随机数字
 * @param min 最小值
 * @param max 最大值
 */
export function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * 获取日期最短表达形式
 * @param date 日期
 */
export function getShortDate(date: Date) {
    const i18n = useI18n();

    moment.locale(i18n.locale.value);

    if (date === undefined) return "";
    if (moment(date).isSame(moment(), 'day')) {
        return moment(date).fromNow().replaceAll(' ', '');
    } else if (moment(date).isSame(moment().add(1, 'day'), 'day')) {
        return i18n.t('date.tomorrow') as string;
    } else if (moment(date).isSame(moment().subtract(1, 'day'), 'day')) {
        return i18n.t('date.yesterday') as string;
    } else if (moment(date).diff(moment(), 'day') <= 31 || moment(date).diff(moment(), 'month') <= 12) {
        return moment(date).fromNow().replaceAll(' ', '');
    } else {
        return moment(date).format('ll');
    }
}

/**
 * 获取两个颜色的对比度和可读性(APCA算法)
 * @param backgroundColor 背景色
 * @param foregroundColor 前景色
 */
export function getColorsContrast(backgroundColor: string, foregroundColor: string) {
    const background = new Color(backgroundColor);
    const foreground = new Color(foregroundColor);
    return background.contrastAPCA(foreground);
}

/**
 * 播放声音
 * @param url 声音文件URL
 */
export function playSound(url: string) {
    const audio = new Audio(new URL(url, import.meta.url).href);
    audio.play();
}
