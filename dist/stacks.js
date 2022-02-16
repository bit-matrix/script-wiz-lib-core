"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tuck = exports.swap = exports.roll = exports.pick = exports.over = exports.nip = exports.ifDup = exports.dup = exports.depth = exports.twoSwap = exports.twoRot = exports.rot = exports.twoOver = exports.threeDup = exports.twoDup = exports.fromAltStack = void 0;
var wiz_data_1 = __importDefault(require("@script-wiz/wiz-data"));
var fromAltStack = function (wizData) { return wizData; };
exports.fromAltStack = fromAltStack;
var twoDup = function (wizData, wizData2) { return [dupData(wizData), dupData(wizData2)]; };
exports.twoDup = twoDup;
var threeDup = function (wizData, wizData2, wizData3) { return [wizData, wizData2, wizData3]; };
exports.threeDup = threeDup;
var twoOver = function (wizData, wizData2) { return [dupData(wizData), dupData(wizData2)]; };
exports.twoOver = twoOver;
var rot = function (wizData, wizData2, wizData3) { return [wizData2, wizData3, wizData]; };
exports.rot = rot;
var twoRot = function (wizData, wizData2, wizData3, wizData4, wizData5, wizData6) { return [
    wizData3,
    wizData4,
    wizData5,
    wizData6,
    wizData,
    wizData2,
]; };
exports.twoRot = twoRot;
var twoSwap = function (wizData, wizData2, wizData3, wizData4) { return [wizData2, wizData, wizData4, wizData3]; };
exports.twoSwap = twoSwap;
var depth = function (length) { return wiz_data_1.default.fromNumber(length); };
exports.depth = depth;
var dup = function (wizData) { return dupData(wizData); };
exports.dup = dup;
var ifDup = function (wizData) {
    if (wizData.number !== undefined && wizData.number === 0) {
        return {};
    }
    return dupData(wizData);
};
exports.ifDup = ifDup;
var nip = function (wizData) { return wizData; };
exports.nip = nip;
var over = function (wizData) { return dupData(wizData); };
exports.over = over;
var pick = function (wizDataArray, stackIndex) { return __spreadArray(__spreadArray([], wizDataArray, true), [dupData(wizDataArray.reverse()[stackIndex])], false); };
exports.pick = pick;
var roll = function (wizDataArray, stackIndex) {
    var newWizDataArray = __spreadArray([], wizDataArray, true).reverse();
    var currentItem = newWizDataArray[stackIndex];
    newWizDataArray.splice(stackIndex, 1);
    newWizDataArray.unshift(currentItem);
    return newWizDataArray.reverse();
};
exports.roll = roll;
var swap = function (wizData, wizData2) { return [wizData, wizData2]; };
exports.swap = swap;
var tuck = function (wizData, wizData2) { return [dupData(wizData2), wizData, wizData2]; };
exports.tuck = tuck;
function dupData(wizData) {
    var newWizData = Object.create(wizData);
    if (newWizData.label)
        newWizData.label += '\'';
    return newWizData;
}
//# sourceMappingURL=stacks.js.map