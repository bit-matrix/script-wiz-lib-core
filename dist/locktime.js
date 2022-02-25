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
    if (txData.inputs[txData.currentInputIndex].sequence === "")
        throw "Sequence must not be empty in transaction template";
    if (currentTransactionInputSequence.number === -2147483647)
        return wiz_data_1.default.fromNumber(0);
    if (timelockNumber < inputNumber)
        return wiz_data_1.default.fromNumber(0);
    return wiz_data_1.default.fromNumber(1);
};
exports.checkLockTimeVerify = checkLockTimeVerify;
var checkSequenceVerify = function (input, txData) {
    if (input.number === undefined)
        throw "Input number is invalid";
    if (txData.version === "")
        throw "Transaction template version is empty";
    var transactionSequenceNumber = wiz_data_1.default.fromHex(txData.inputs[txData.currentInputIndex].sequence);
    if (txData.inputs[txData.currentInputIndex].sequence === "")
        throw "Sequence must not be empty in transaction template";
    if (transactionSequenceNumber.number === undefined)
        throw "Transaction template sequence is invalid";
    var inputUnitValue = parseInt(input.bin.slice(16, 33), 2);
    var inputDisableFlag = input.bin[0];
    var inputTypeFlag = input.bin[9];
    var transactionBlockUnitValue = parseInt(transactionSequenceNumber.bin.slice(16, 33), 2);
    var transactionTypeFlag = transactionSequenceNumber.bin[9];
    if (inputUnitValue > transactionBlockUnitValue)
        return wiz_data_1.default.fromNumber(0);
    if (Number(txData.version) < 2)
        return wiz_data_1.default.fromNumber(0);
    if (input.number < 0)
        return wiz_data_1.default.fromNumber(0);
    if (Number(inputDisableFlag) !== 0)
        return wiz_data_1.default.fromNumber(0);
    if (Number(inputTypeFlag) === 0 && Number(transactionTypeFlag) === 1)
        return wiz_data_1.default.fromNumber(0);
    if (Number(inputTypeFlag) === 1 && Number(transactionTypeFlag) === 0)
        return wiz_data_1.default.fromNumber(0);
    return wiz_data_1.default.fromNumber(1);
};
exports.checkSequenceVerify = checkSequenceVerify;
//# sourceMappingURL=locktime.js.map