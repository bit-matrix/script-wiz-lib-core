"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSequenceVerify = exports.checkLockTimeVerify = void 0;
var wiz_data_1 = __importDefault(require("@script-wiz/wiz-data"));
var checkLockTimeVerify = function (input, txData) {
    var timelockNumber = Number(txData.timelock);
    var inputNumber = input.number;
    var LOCKTIME_THRESHOLD = 500000000;
    if (inputNumber === undefined)
        throw "Error: Invalid input: this operation requires a valid Script Number";
    if (txData.timelock === undefined)
        throw "Timelock is undefined";
    if (isNaN(timelockNumber))
        throw "Timelock is not a valid number";
    if (inputNumber < 0)
        return wiz_data_1.default.fromNumber(0);
    if (LOCKTIME_THRESHOLD > inputNumber && LOCKTIME_THRESHOLD < timelockNumber)
        return wiz_data_1.default.fromNumber(0);
    if (LOCKTIME_THRESHOLD < inputNumber && LOCKTIME_THRESHOLD > timelockNumber)
        return wiz_data_1.default.fromNumber(0);
    var currentTransactionInputSequence = wiz_data_1.default.fromHex(txData.inputs[txData.currentInputIndex].sequence);
    if (currentTransactionInputSequence.number === -2147483647)
        return wiz_data_1.default.fromNumber(0);
    if (timelockNumber < inputNumber)
        return wiz_data_1.default.fromNumber(0);
    return wiz_data_1.default.fromNumber(1);
};
exports.checkLockTimeVerify = checkLockTimeVerify;
var checkSequenceVerify = function (wizData) {
    if (wizData.number !== undefined) {
        return wiz_data_1.default.fromNumber(1);
    }
    throw "Error: Invalid input: this operation requires a valid Script Number";
};
exports.checkSequenceVerify = checkSequenceVerify;
//# sourceMappingURL=locktime.js.map