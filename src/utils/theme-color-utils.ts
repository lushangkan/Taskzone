import Color from "colorjs.io";

/**
 * 生成css颜色变量从黑到亮不同亮度的版本，并保存在后缀为100,200,-100,-200...的css变量中, 并返回一个颜色Map
 * @param colorVar css变量颜色
 * @returns 生成的颜色Map
 */
export function generateColorVariants(colorVar: string): Map<number, Color> {
    const colorMap = new Map<number, Color>();
    const root = document.documentElement;
    const oldColor = `hsl(${getComputedStyle(root).getPropertyValue(colorVar)})`;
    const oldColorObj = new Color(oldColor);
    colorMap.set(0, oldColorObj);
    const styleElement = document.createElement('style');

    styleElement.innerText += ':root {';

    for (let i = 1; i <= 10; i++) {
        const newColor = new Color(oldColor);
        newColor.lch.l += i * 2;
        colorMap.set(i * 100, newColor);
        styleElement.innerText += `${colorVar}-${i * 100}: ${newColor.to("hsl").toString().match('(?<=\\()[^\\(\\)]*(?=\\))')?.[0]};`;
    }
    for (let i = 1; i <= 10; i++) {
        const newColor = new Color(oldColor);
        newColor.lch.l -= i * 2;
        colorMap.set(-i * 100, newColor);
        styleElement.innerText += `${colorVar}-${-i * 100}: ${newColor.to("hsl").toString().match('(?<=\\()[^\\(\\)]*(?=\\))')?.[0]};`;
    }

    styleElement.innerText += '}';
    document.head.appendChild(styleElement);

    return colorMap;
}

/**
 * 生成主题颜色的各种版本,并保存在css变量
 */
export function generateThemeColorVariants(): void {
    generateColorVariants('--p');
    generateColorVariants('--s');
    generateColorVariants('--a');
    generateColorVariants('--n');
    generateColorVariants('--b1');
    generateColorVariants('--b2');
    generateColorVariants('--b3');
    generateColorVariants('--wa');
    generateColorVariants('--su');
    generateColorVariants('--er');
    generateColorVariants('--in');
}

