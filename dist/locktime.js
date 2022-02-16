"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSequenceVerify = exports.checkLockTimeVerify = void 0;
var wiz_data_1 = __importDefault(require("@script-wiz/wiz-data"));
var checkLockTimeVerify = function (wizData) {
    if (wizData.number !== undefined) {
        return wiz_data_1.default.fromNumber(1);
    }
    throw "Error: Invalid input: this operation requires a valid Script Number";
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