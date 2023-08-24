import { isEmojiSupported } from "is-emoji-supported";
import EmojiCss from '@/assets/styles/fonts/emoji.less'

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
