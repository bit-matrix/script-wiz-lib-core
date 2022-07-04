"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputConverter = exports.LE32ToNum = exports.LE32toLE64 = exports.LE64ToNum = exports.convert32 = exports.numToLE32 = exports.numToLE64LE = exports.numToLE64 = exports.convert64 = void 0;
var wiz_data_1 = __importStar(require("@script-wiz/wiz-data"));
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
var numToLE64LE = function (wizData) {
    var inputHex = (0, exports.numToLE64)(wizData).hex;
    var inputHexLe = (0, wiz_data_1.hexLE)(inputHex);
    return wiz_data_1.default.fromHex(inputHexLe);
};
exports.numToLE64LE = numToLE64LE;
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
var inputConverter = function (value, type, byteLength) {
    var _a, _b, _c, _d;
    if (byteLength === "8-bytes") {
        if (type === "BE") {
            var valueWizData = wiz_data_1.default.fromHex(value);
            //le
            var le = (0, wiz_data_1.hexLE)(valueWizData.hex);
            //decimal
            var leWizData = wiz_data_1.default.fromHex(le);
            var decimal = (_a = (0, exports.LE64ToNum)(leWizData).number) === null || _a === void 0 ? void 0 : _a.toString();
            return { be: value, le: le, decimal: decimal || "" };
        }
        if (type === "LE") {
            var valueWizData = wiz_data_1.default.fromHex(value);
            //be
            var be = (0, wiz_data_1.hexLE)(valueWizData.hex);
            //decimal
            var decimal = (_b = (0, exports.LE64ToNum)(valueWizData).number) === null || _b === void 0 ? void 0 : _b.toString();
            return { be: be, le: value, decimal: decimal || "" };
        }
        if (type === "Decimal") {
            //decimal
            var sathoshi = Number(value) * 100000000;
            var sathoshiWizData = wiz_data_1.default.fromNumber(sathoshi);
            //le
            var le = (0, exports.numToLE64)(sathoshiWizData);
            //be
            var beHex = (0, wiz_data_1.hexLE)(le.hex);
            return { be: beHex, le: le.hex, decimal: value };
        }
    }
    if (byteLength === "4-bytes") {
        if (type === "BE") {
            var valueWizData = wiz_data_1.default.fromHex(value);
            console.log(valueWizData);
            //le
            var le = (0, wiz_data_1.hexLE)(valueWizData.hex);
            console.log(le);
            //decimal
            var leWizData = wiz_data_1.default.fromHex(le);
            var decimal = (_c = (0, exports.LE32ToNum)(leWizData).number) === null || _c === void 0 ? void 0 : _c.toString();
            console.log(decimal);
            return { be: value, le: le, decimal: decimal || "" };
        }
        if (type === "LE") {
            var valueWizData = wiz_data_1.default.fromHex(value);
            console.log(valueWizData);
            //be
            var be = (0, wiz_data_1.hexLE)(valueWizData.hex);
            console.log(be);
            //decimal
            var decimal = (_d = (0, exports.LE32ToNum)(valueWizData).number) === null || _d === void 0 ? void 0 : _d.toString();
            console.log(decimal);
            return { be: be, le: value, decimal: decimal || "" };
        }
        if (type === "Decimal") {
            //decimal
            var sathoshiWizData = wiz_data_1.default.fromNumber(Number(value));
            console.log("sathoshiWizData", sathoshiWizData);
            //le
            var le = (0, exports.numToLE32)(sathoshiWizData);
            console.log("leHex", le.hex);
            //be
            var beHex = (0, wiz_data_1.hexLE)(le.hex);
            console.log(beHex);
            return { be: beHex, le: le.hex, decimal: value };
        }
    }
    return { decimal: "", le: "", be: "" };
};
exports.inputConverter = inputConverter;
//# sourceMappingURL=convertion.js.map