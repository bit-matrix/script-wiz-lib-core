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
exports.emptyUnit = exports.calculateInputSequences = exports.calculateInputScriptPubkeys = exports.calculateInputAmounts = exports.calculatePrevouts = exports.calculateHashOutputs = void 0;
var wiz_data_1 = __importStar(require("@script-wiz/wiz-data"));
var convertion_1 = require("../convertion");
var crypto_1 = require("../crypto");
var splices_1 = require("../splices");
var calculateHashOutputs = function (outputs, isSegwit) {
    if (isSegwit === void 0) { isSegwit = true; }
    var hashOutputs = "";
    outputs.forEach(function (output) {
        if (output.amount === "" || output.scriptPubKey === "")
            throw "Amount and scriptPubkey must not be empty in output transaction template";
        hashOutputs += (0, convertion_1.numToLE64)(wiz_data_1.default.fromNumber(Number(output.amount) * 100000000)).hex + (0, splices_1.size)(wiz_data_1.default.fromHex(output.scriptPubKey)).hex + output.scriptPubKey;
    });
    return isSegwit ? (0, crypto_1.hash256)(wiz_data_1.default.fromHex(hashOutputs)).toString() : (0, crypto_1.sha256)(wiz_data_1.default.fromHex(hashOutputs)).toString();
};
exports.calculateHashOutputs = calculateHashOutputs;
var calculatePrevouts = function (inputs, isSegwit) {
    if (isSegwit === void 0) { isSegwit = true; }
    var hashInputs = "";
    inputs.forEach(function (input) {
        if (input.previousTxId === "" || input.vout === "")
            throw "Previous tx id and vout must not be empty";
        var vout = (0, convertion_1.numToLE32)(wiz_data_1.default.fromNumber(Number(input.vout))).hex;
        hashInputs += wiz_data_1.default.fromHex((0, wiz_data_1.hexLE)(input.previousTxId) + vout).hex;
    });
    return isSegwit ? (0, crypto_1.hash256)(wiz_data_1.default.fromHex(hashInputs)).toString() : (0, crypto_1.sha256)(wiz_data_1.default.fromHex(hashInputs)).toString();
};
exports.calculatePrevouts = calculatePrevouts;
var calculateInputAmounts = function (inputs) {
    var inputAmounts = "";
    inputs.forEach(function (input) {
        if (input.amount === "")
            throw "Input amounts must not be empty";
        inputAmounts += (0, convertion_1.numToLE64)(wiz_data_1.default.fromNumber(Number(input.amount) * 100000000)).hex;
    });
    return (0, crypto_1.sha256)(wiz_data_1.default.fromHex(inputAmounts)).toString();
};
exports.calculateInputAmounts = calculateInputAmounts;
var calculateInputScriptPubkeys = function (inputs) {
    var inputScriptPubkeys = "";
    inputs.forEach(function (input) {
        if (input.scriptPubKey === "")
            throw "Input script pubkey must not be empty";
        inputScriptPubkeys += (0, splices_1.size)(wiz_data_1.default.fromHex(input.scriptPubKey)).hex + input.scriptPubKey;
    });
    return (0, crypto_1.sha256)(wiz_data_1.default.fromHex(inputScriptPubkeys)).toString();
};
exports.calculateInputScriptPubkeys = calculateInputScriptPubkeys;
var calculateInputSequences = function (inputs) {
    var inputSequences = "";
    inputs.forEach(function (input) {
        if (input.sequence === "")
            throw "Input script sequence must not be empty";
        inputSequences += (0, wiz_data_1.hexLE)(input.sequence);
    });
    return (0, crypto_1.sha256)(wiz_data_1.default.fromHex(inputSequences)).toString();
};
exports.calculateInputSequences = calculateInputSequences;
exports.emptyUnit = "00000000000000000000000000000000";
//# sourceMappingURL=serializationutils.js.map