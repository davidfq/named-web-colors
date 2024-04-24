"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var curated_json_1 = __importDefault(require("../data/curated.json"));
var web_json_1 = __importDefault(require("../data/web.json"));
var werner_json_1 = __importDefault(require("../data/werner.json"));
var availableColors = (_a = {},
    _a[ColorsListKey.Curated] = curated_json_1.default,
    _a[ColorsListKey.Web] = web_json_1.default,
    _a[ColorsListKey.Werner] = werner_json_1.default,
    _a);
function getColorName(code, options) {
    var colors;
    if (Object.keys(availableColors).includes(options.list)) {
        colors = availableColors[options.list];
    }
    else {
        colors = Object.values(availableColors).reduce(function (prev, cur) {
            return __assign(__assign({}, prev), cur);
        }, {});
    }
    console.log(colors);
    return null;
}
exports.default = getColorName;
