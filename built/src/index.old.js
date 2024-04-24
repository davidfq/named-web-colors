"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var color_string_1 = __importDefault(require("color-string"));
var curated_json_1 = __importDefault(require("../data/curated.json"));
var web_json_1 = __importDefault(require("../data/web.json"));
var werner_json_1 = __importDefault(require("../data/werner.json"));
var WHITE = color_string_1.default.get('#fff');
var BLACK = color_string_1.default.get('#000');
/**
 * Describes a matched color.
 *
 * @typedef {Object} ColorOutput
 * @property {string} name - The name of the matched color, e.g., 'red'
 * @property {string} hex - Hex color code e.g., '#FF0'
 * @property {string} rgb - RGB definition (or RGBA for colors with alpha channel).
 * @property {string} css - CSS custom property alike definition, e.g.
 *  `--color-prussian-blue: #004162`
 * @property {number} distance - Calculated distance between input and matched color.
 */
/**
 * Square root of sum of the squares of the differences in values
 * [red, green, blue, opacity]
 *
 * @param {Array} color1
 * @param {Array} color2
 * @return {Number}
 */
var euclideanDistance = function (color1, color2) {
    return Math.sqrt(Math.pow(color1[0] - color2[0], 2) +
        Math.pow(color1[1] - color2[1], 2) +
        Math.pow(color1[2] - color2[2], 2));
};
var MAX_DISTANCE = euclideanDistance(WHITE.value, BLACK.value);
/**
 * Combines foreground and background colors.
 * ref: https://en.wikipedia.org/wiki/Transparency_%28graphic%29
 *
 * @param {Array} foreground - [red, green, blue, alpha]
 * @param {Array} background - [red, green, blue, alpha]
 * @return {Array} - [red, green, blue, alpha=1]
 */
var blend = function (foreground, background) {
    var opacity = foreground[3];
    return [
        ((1 - opacity) * background[0]) + (opacity * foreground[0]),
        ((1 - opacity) * background[1]) + (opacity * foreground[1]),
        ((1 - opacity) * background[2]) + (opacity * foreground[2]),
        1
    ];
};
/**
 * Calculates color distance based on whether first param color input has
 * alpha channel or not.
 *
 * @param {Array} color1
 * @param {Array} color2
 * @return {number}
 */
var comparativeDistance = function (color1, color2) {
    if (color1[3] === 1 && color2[3] === 1) {
        // solid colors: use basic Euclidean distance algorithm
        return euclideanDistance(color1, color2);
    }
    else {
        // alpha channel: combine input color with white and black backgrounds
        // and comparte distances
        var withWhite = euclideanDistance(blend(color1, WHITE.value), color2);
        var withBlack = euclideanDistance(blend(color1, BLACK.value), color2);
        return withWhite <= withBlack ? withWhite : withBlack;
    }
};
/**
 * Transform color name to web-safe slug.
 *
 * @param {string} string
 * @return {string}
 */
var slugify = function (string, separator) {
    if (string === void 0) { string = ''; }
    if (separator === void 0) { separator = '-'; }
    return string.trim().split('').reduce(function (memo, char) {
        return memo + char.replace(/'/, '').replace(/\s/, separator);
    }, '').toLocaleLowerCase();
};
/**
 * Simple RGB comparation method.
 *
 * @param {Array} color1
 * @param {Array} color2
 * @param {boolean} ignoreAlphaChannel
 */
var compareRGB = function (color1, color2, ignoreAlphaChannel) {
    if (ignoreAlphaChannel === void 0) { ignoreAlphaChannel = false; }
    var result = false;
    if (color1.length === 4 && color2.length === 4) {
        result = color1[0] === color2[0] &&
            color1[1] === color2[1] &&
            color1[2] === color2[2];
        result = ignoreAlphaChannel ? result : color1[3] === color2[3];
    }
    return result;
};
/**
 * Build output color object spec.
 *
 * @param {string} name - resolved color name
 * @param {string} hex - Hex color code
 * @param {Object} colorInput
 * @param {number} distance
 * @param {boolean} ignoreAlphaChannel
 * @return {ColorOutput}
 */
var buildColorOutput = function (name, hex, colorInput, distance, ignoreAlphaChannel) {
    var alpha = Number(colorInput.value[3]).toFixed(2);
    var slug = slugify(name);
    var result = {
        name: name,
        distance: distance
    };
    if (ignoreAlphaChannel) {
        result.hex = "#".concat(hex);
        result.css = "--color-".concat(slug, ": ").concat(result.hex);
    }
    else {
        // use HEX code from input directly as none of the curated colors have
        // alpha channel defined; test
        result.hex = color_string_1.default.to.hex(colorInput.value);
        // normalize alpha suffix
        var alphaSuffix = '';
        if (alpha > 0 && alpha < 1) {
            alphaSuffix = "-".concat(Math.round(alpha * 100));
        }
        result.css = "--color-".concat(slug).concat(alphaSuffix, ": ").concat(result.hex);
    }
    // double check final result; `color-string` don't support HSL input
    // transforms to HEX (when input contains decimals, @see tests),
    // so `result.hex` may not be valid at this point
    if (color_string_1.default.get(result.hex) !== null) {
        var rgb = color_string_1.default.get(result.hex).value;
        // round alpha value
        var rgbAlpha = Number.parseFloat(Number(rgb[3]).toFixed(2));
        result.rgb = color_string_1.default.to.rgb([rgb[0], rgb[1], rgb[2], rgbAlpha]);
    }
    else {
        result = undefined;
    }
    return result;
};
/**
 * Main function to find the closest color among "colors" list.
 *
 * @param {string} code - color code: Hex, RGB or HSL
 * @param {Object} colors - color list: keys are Hex codes and values are color names
 * @param {boolean} ignoreAlphaChannel - whether to ignore alpha channel on input
 */
var getColor = function (code, colors, ignoreAlphaChannel) {
    if (ignoreAlphaChannel === void 0) { ignoreAlphaChannel = false; }
    var colorInput = color_string_1.default.get(code);
    var colorKeys = Object.keys(colors);
    var colorKeyMatch;
    var distance = MAX_DISTANCE;
    var result;
    if (colorInput !== null) {
        // check if there's an exact match (it only happens with solid colors)
        if (!ignoreAlphaChannel) {
            colorKeyMatch = colorKeys.find(function (key) {
                var color = color_string_1.default.get("#".concat(key));
                return compareRGB(color.value, colorInput.value, true);
            });
        }
        if (colorKeyMatch !== undefined) {
            distance = 0;
        }
        if (distance > 0) {
            // let's find the closest one
            var calculateDistance_1 = ignoreAlphaChannel ? comparativeDistance : euclideanDistance;
            colorKeys.forEach(function (key) {
                var colorCandidate = color_string_1.default.get("#".concat(key));
                var tmpDistance = calculateDistance_1(colorInput.value, colorCandidate.value);
                if (tmpDistance < distance) {
                    colorKeyMatch = key;
                    distance = tmpDistance;
                }
            });
        }
    }
    if (colorKeyMatch !== undefined) {
        result = buildColorOutput(colors[colorKeyMatch], colorKeyMatch, colorInput, distance, ignoreAlphaChannel);
    }
    return result;
};
function getColorName(code, options) {
    if (options === void 0) { options = {}; }
    var colors = Object.assign({}, web_json_1.default, curated_json_1.default);
    if (options.list && options.list === 'web') {
        colors = web_json_1.default;
    }
    else if (options.list && options.list === 'werner') {
        colors = werner_json_1.default;
    }
    return getColor(code, colors, options.ignoreAlphaChannel);
}
exports.default = getColorName;
