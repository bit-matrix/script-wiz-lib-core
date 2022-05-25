"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LE32ToNum = exports.LE32toLE64 = exports.LE64ToNum = exports.convert32 = exports.numToLE32 = exports.numToLE64 = exports.convert64 = void 0;
var wiz_data_1 = __importDefault(require("@script-wiz/wiz-data"));
var bn_js_1 = __importDefault(require("bn.js"));
var convert64 = function (wizData) {
    var isNegate = wizData.bin.charAt(0) === "1";
    var input = new bn_js_1.default(wizData.bin, 2);
    if (!isNegate) {
        var input64 = input.toString(2, 64);
        return wiz_data_1.default.fromBin(input64);
    }
    else {
        if (wizData.number)
            input = new bn_js_1.default(wizData.number || 0);
        var negateValue = input.abs().neg();
        var twosNegateValue = negateValue.toTwos(64);
        var twosNegateValue64 = twosNegateValue.toString(2, 64);
        return wiz_data_1.default.fromBin(twosNegateValue64);
    }
};
exports.convert64 = convert64;
var numToLE64 = function (wizData) {
    var inputByteLength = wizData.bytes.length;
    if (inputByteLength > 8)
        throw "Input byte length must be maximum 8 byte";
    return (0, exports.convert64)(wizData);
};
exports.numToLE64 = numToLE64;
var numToLE32 = function (wizData) {
    var inputByteLength = wizData.bytes.length;
    if (inputByteLength > 4)
        throw "Input byte length must be maximum 4 byte";
    return (0, exports.convert32)(wizData);
};
exports.numToLE32 = numToLE32;
var convert32 = function (wizData) {
    var isNegate = wizData.bin.charAt(0) === "1";
    var input = new bn_js_1.default(wizData.bin, 2);
    if (!isNegate) {
        var input32 = input.toString(2, 32);
        return wiz_data_1.default.fromBin(input32);
    }
    else {
        if (wizData.number)
            input = new bn_js_1.default(wizData.number || 0);
        var negateValue = input.abs().neg();
        var twosNegateValue = negateValue.toTwos(32);
        var twosNegateValue32 = twosNegateValue.toString(2, 32);
        return wiz_data_1.default.fromBin(twosNegateValue32);
    }
};
exports.convert32 = convert32;
var LE64ToNum = function (wizData) {
    var inputBytes = wizData.bytes;
    if (inputBytes.length !== 8)
        throw "Input byte length must be equal 8 byte";
    var inputArray = Array.from(wizData.bytes);
    var i = 7;
    while (i >= 0) {
        if (inputArray[i] === 0) {
            inputArray.pop();
            i--;
        }
        else {
            break;
        }
    }
    var lastElement = wiz_data_1.default.fromNumber(inputArray[inputArray.length - 1]);
    var misingByte = lastElement.bytes.length > 1 ? 1 : 0;
    var inputBN = new bn_js_1.default(wizData.bin, 2);
    var inputBnByteLength = inputBN.byteLength() + misingByte;
    if (wizData.bin.charAt(0) === "1") {
        var binputPos = inputBN.fromTwos(64).abs();
        var inputWizData = wiz_data_1.default.fromBin(binputPos.toString(2, (binputPos.byteLength() + misingByte) * 8));
        if (inputWizData.number) {
            return wiz_data_1.default.fromNumber(inputWizData.number * -1);
        }
        return inputWizData;
    }
    var finalBinValue = inputBN.toString(2, inputBnByteLength * 8);
    if (finalBinValue === "0") {
        return wiz_data_1.default.fromNumber(0);
    }
    return wiz_data_1.default.fromBin(finalBinValue);
};
exports.LE64ToNum = LE64ToNum;
var LE32toLE64 = function (wizData) {
    if (wizData.bytes.length !== 4)
        throw "Input byte length must be equal 4 byte";
    return (0, exports.numToLE64)(wizData);
};
exports.LE32toLE64 = LE32toLE64;
var LE32ToNum = function (wizData) {
    var inputBytes = wizData.bytes;
    if (inputBytes.length !== 4)
        throw "Input byte length must be equal 4 byte";
    var inputArray = Array.from(wizData.bytes);
    var i = 3;
    while (i >= 0) {
        if (inputArray[i] === 0) {
            inputArray.pop();
            i--;
        }
        else {
            break;
        }
    }
    var lastElement = wiz_data_1.default.fromNumber(inputArray[inputArray.length - 1]);
    var misingByte = lastElement.bytes.length > 1 ? 1 : 0;
    var inputBN = new bn_js_1.default(wizData.bin, 2);
    var inputBnByteLength = inputBN.byteLength() + misingByte;
    if (wizData.bin.charAt(0) === "1") {
        var binputPos = inputBN.fromTwos(32).abs();
        var inputWizData = wiz_data_1.default.fromBin(binputPos.toString(2, (binputPos.byteLength() + misingByte) * 4));
        if (inputWizData.number) {
            return wiz_data_1.default.fromNumber(inputWizData.number * -1);
        }
        return inputWizData;
    }
    var finalBinValue = inputBN.toString(2, inputBnByteLength * 4);
    if (finalBinValue === "0") {
        return wiz_data_1.default.fromNumber(0);
    }
    return wiz_data_1.default.fromBin(finalBinValue);
};
exports.LE32ToNum = LE32ToNum;
// LE64TONum alternative
// export const LE64ToNum = (wizData: WizData): WizData => {
//   const inputBytes = wizData.bytes;
//   if (inputBytes.length !== 8) throw "Input byte length must be equal 8 byte";
//   let result = Array.from(inputBytes);
//   let i = 7;
//   while (i >= 0) {
//     if (inputBytes[i] > 0) {
//       break;
//     }
//     result = result.slice(0, -1);
//     i--;
//   }
//   const finalResult = new Uint8Array(result);
//   return WizData.fromBytes(finalResult);
// };
//# sourceMappingURL=convertion.js.map