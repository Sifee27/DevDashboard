/**
 * Function adapted from Michael Jackson's JS code at:
 * https://gist.github.com/mjackson/5311256
 * 
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from https://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {JSON}           The RGB representation
 */
export function HSLtoRGB(h: number, s: number, l: number): { "r": number, "g": number, "b": number } {
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hueToRGB(p, q, h + 1 / 3);
        g = hueToRGB(p, q, h);
        b = hueToRGB(p, q, h - 1 / 3);
    }

    return {
        "r": Math.round(r * 255),
        "g": Math.round(g * 255),
        "b": Math.round(b * 255)
    };
}

function hueToRGB(p: number, q: number, t: number) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}

// returns a random integer from min to max (inclusive)
function randomInt(min: number, max: number) {
    return min + Math.floor(Math.random() * (1 + max - min));
}

export function randomColor(sMin: number, sMax: number, lMin: number, lMax: number): {
    "hsl": {
        "h": number,
        "s": number,
        "l": number
    },
    "rgb": {
        "r": number,
        "g": number,
        "b": number
    },
    "hex": string
} {
    var hue = randomInt(0, 359);
    var saturation = randomInt(sMin, sMax);
    var lightness = randomInt(lMin, lMax);

    var { r, g, b } = HSLtoRGB(hue, saturation, lightness);
    var hex = RGBtoHex(r, g, b);

    return {
        "hsl": {
            "h": hue,
            "s": saturation,
            "l": lightness,
        },
        "rgb": {
            "r": r,
            "g": g,
            "b": b
        },
        "hex": hex
    };
}

export function RGBtoHex(r: number, g: number, b: number) {
    var red = r * Math.pow(16, 4);
    var green = g * Math.pow(16, 2);
    var blue = b;

    return "#" + (r + g + b).toString(16);
}