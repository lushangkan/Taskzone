import {isEmojiSupported} from "is-emoji-supported";
import EmojiCss from '@/assets/styles/fonts/emoji.less'
import Color from "colorjs.io";
import Emojis from "@/assets/data/emojis.json"
import OpenColor from "open-color";

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
 * 根据背景色获取文本颜色
 * @param backgroundColorText 背景色
 * @return 文本颜色, black或white
 */
export function getTextColor(backgroundColorText: string) {
    const backgroundColor = new Color(backgroundColorText);
    const brightness = ((backgroundColor.srgb[0]*255*299) +
        (backgroundColor.srgb[1]*255*587) +
        (backgroundColor.srgb[2]*255*114)) / 1000;
    return (brightness > 125) ? 'black' : 'white';
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
 * 从OpenColor随机生成emoji
 */
export function randomEmojiFromOpenColor(colorCode?: Array<number>) {
    colorCode = colorCode === undefined? [3,4,5,6]: colorCode;
    const entries = Object.entries(OpenColor).filter((name) => {
        return name[0] !== 'white' && name[0] !== 'black';
    });
    return entries[getRandomElements(entries)][1][getRandomElements(colorCode)];
}
