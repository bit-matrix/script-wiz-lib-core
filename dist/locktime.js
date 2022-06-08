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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSequenceVerify = exports.checkLockTimeVerify = void 0;
var wiz_data_1 = __importStar(require("@script-wiz/wiz-data"));
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
    if (txData.inputs[txData.currentInputIndex].sequence === "")
        throw "Sequence must not be empty in transaction template";
    var transactionSequenceNumber = wiz_data_1.default.fromHex((0, wiz_data_1.hexLE)(txData.inputs[txData.currentInputIndex].sequence));
    var inputDisableFlag = input.bin[0];
    var inputTypeFlag = input.bin[9];
    var transactionBlockUnitValue = parseInt(transactionSequenceNumber.bin.slice(16, 33), 2);
    var transactionTypeFlag = transactionSequenceNumber.bin[9];
    if (input.number > transactionBlockUnitValue)
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