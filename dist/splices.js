"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.substrLazy = exports.size = exports.left = exports.right = exports.substr = exports.concatenate = void 0;
var wiz_data_1 = __importDefault(require("@script-wiz/wiz-data"));
var concatenate = function (wizData, wizData2) {
    if (wizData.hex === "" && wizData2.hex === "")
        return wiz_data_1.default.fromNumber(0);
    return wiz_data_1.default.fromHex(wizData.hex + wizData2.hex);
};
exports.concatenate = concatenate;
var substr = function (wizData, wizData2, wizData3) {
    var message = wizData.hex;
    var index = wizData2.number;
    var size = wizData3.number;
    if (message.length / 2 < Number(size)) {
        throw "Size number must be lower than message length.";
    }
    if (Number(index) < 0 || Number(size) < 0) {
        throw "Index and size numbers must be greater than 0.";
    }
    if (Number(index) >= message.length / 2) {
        throw "Message length must be greater than index.";
    }
    if ((Number(index) + Number(size)) > (message.length / 2)) {
        throw "Operation not valid with the current stack size";
    }
    if (index !== undefined && size !== undefined) {
        var result = message.substr(index * 2, size * 2);
        return wiz_data_1.default.fromHex(result);
    }
    throw "Index and size must be number!";
};
exports.substr = substr;
var right = function (wizData, wizData2) {
    if (wizData2.number !== undefined) {
        var message = wizData.hex;
        var size_1 = wizData2.number * 2;
        if (size_1 < 0)
            throw "Error: Size can't be negative integer!";
        if (message.length < size_1)
            throw "Error: Size can't higher than data length!";
        if (size_1 === 0)
            return wiz_data_1.default.fromNumber(0);
        var result = message.slice(size_1 * -1);
        return wiz_data_1.default.fromHex(result);
    }
    throw "Size must be number!";
};
exports.right = right;
var left = function (wizData, wizData2) {
    if (wizData2.number !== undefined) {
        var message = wizData.hex;
        var size_2 = wizData2.number * 2;
        if (size_2 < 0)
            throw "Error: Size can't be negative integer.!";
        if (message.length < size_2)
            throw "Error: Size can't higher than data length!";
        if (size_2 === 0)
            wiz_data_1.default.fromNumber(0);
        var result = message.substr(0, size_2);
        return wiz_data_1.default.fromHex(result);
    }
    throw "Error: Size must be number!";
};
exports.left = left;
var size = function (wizData) {
    var numberValue = wizData.hex.length / 2;
    return wiz_data_1.default.fromNumber(numberValue);
};
exports.size = size;
var substrLazy = function (wizData, wizData2, wizData3) {
    if (wizData2.number !== undefined && wizData3.number !== undefined) {
        var message = wizData.hex;
        var index = wizData2.number * 2;
        var length_1 = wizData3.number * 2;
        var messageSize = message.length;
        if (index < 0)
            index = 0;
        if (length_1 < 0)
            length_1 = 0;
        if (index >= messageSize)
            wiz_data_1.default.fromNumber(0);
        if (index + length_1 > messageSize) {
            length_1 = messageSize - index;
        }
        var result = message.substr(index, length_1);
        return wiz_data_1.default.fromHex(result);
    }
    throw "Error: Index and size must be number!";
};
exports.substrLazy = substrLazy;
//# sourceMappingURL=splices.js.map