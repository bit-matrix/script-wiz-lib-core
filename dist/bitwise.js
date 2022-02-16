"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.equal = exports.xor = exports.or = exports.and = exports.invert = void 0;
var wiz_data_1 = __importDefault(require("@script-wiz/wiz-data"));
var utils_1 = require("./utils");
var invert = function (wizData) {
    var complement = (0, utils_1.flipbits)(wizData.bin);
    return wiz_data_1.default.fromBin(complement);
};
exports.invert = invert;
var and = function (wizData, wizData2) {
    var fBinary = wizData.bin;
    var sBinary = wizData2.bin;
    if (fBinary.length === sBinary.length) {
        var fBinaryArray = fBinary.split("").map(function (x) { return +x; });
        var sBinaryArray = sBinary.split("").map(function (x) { return +x; });
        var resultBinary = "";
        for (var i in fBinaryArray) {
            resultBinary += fBinaryArray[i] & sBinaryArray[i];
        }
        return wiz_data_1.default.fromBin(resultBinary);
    }
    // stack bump
    throw "Bitwise operation on operands of different lengths.";
};
exports.and = and;
var or = function (wizData, wizData2) {
    var fBinary = wizData.bin;
    var sBinary = wizData2.bin;
    if (fBinary.length === sBinary.length) {
        var fBinaryArray = fBinary.split("").map(function (x) { return +x; });
        var sBinaryArray = sBinary.split("").map(function (x) { return +x; });
        var resultBinary = "";
        for (var i in fBinaryArray) {
            resultBinary += fBinaryArray[i] | sBinaryArray[i];
        }
        return wiz_data_1.default.fromBin(resultBinary);
    }
    // stack bump
    throw "Bitwise operation on operands of different lengths.";
};
exports.or = or;
var xor = function (wizData, wizData2) {
    var fBinary = wizData.bin;
    var sBinary = wizData2.bin;
    if (fBinary.length === sBinary.length) {
        var fBinaryArray = fBinary.split("").map(function (x) { return +x; });
        var sBinaryArray = sBinary.split("").map(function (x) { return +x; });
        var resultBinary = "";
        for (var i in fBinaryArray) {
            resultBinary += fBinaryArray[i] ^ sBinaryArray[i];
        }
        return wiz_data_1.default.fromBin(resultBinary);
    }
    // stack bump
    throw "Bitwise operation on operands of different lengths.";
};
exports.xor = xor;
var equal = function (wizData, wizData2) {
    var expression = wizData.hex === wizData2.hex && wizData.bin === wizData2.bin;
    return wiz_data_1.default.fromNumber(expression ? 1 : 0);
};
exports.equal = equal;
//# sourceMappingURL=bitwise.js.map