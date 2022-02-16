"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toHexString = exports.flipbits = exports.NEGATIVE_1_64 = exports.MIN_INTEGER_64 = exports.MAX_INTEGER_64 = exports.ZERO_64 = void 0;
var wiz_data_1 = __importDefault(require("@script-wiz/wiz-data"));
var bn_js_1 = __importDefault(require("bn.js"));
var convertion_1 = require("../convertion");
exports.ZERO_64 = new bn_js_1.default((0, convertion_1.convert64)(wiz_data_1.default.fromHex("00")).bin, 2);
exports.MAX_INTEGER_64 = new bn_js_1.default("1111111111111111111111111111111111111111111111111111111101111111", 2);
exports.MIN_INTEGER_64 = new bn_js_1.default("0000000000000000000000000000000000000000000000000000000010000000", 2);
exports.NEGATIVE_1_64 = new bn_js_1.default("0000000000000000000000000000000000000000000000000000000010000001", 2);
var flipbits = function (str) {
    return str
        .split("")
        .map(function (b) { return (1 - b).toString(); })
        .join("");
};
exports.flipbits = flipbits;
var toHexString = function (byteArray) {
    return Array.from(byteArray, function (byte) {
        return ("0" + (byte & 0xff).toString(16)).slice(-2);
    }).join("");
};
exports.toHexString = toHexString;
//# sourceMappingURL=index.js.map