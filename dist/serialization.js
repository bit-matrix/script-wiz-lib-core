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
exports.taprootSerialization = exports.segwitSerialization = void 0;
var wiz_data_1 = __importStar(require("@script-wiz/wiz-data"));
var convertion_1 = require("./convertion");
var crypto_1 = require("./crypto");
var splices_1 = require("./splices");
var taproot_1 = require("./taproot");
var model_1 = require("./taproot/model");
// ref https://github.com/bitcoin/bips/blob/master/bip-0143.mediawiki
// Double SHA256 of the serialization of:
// 1. nVersion of the transaction (4-byte little endian)
// 2. hashPrevouts (32-byte hash)
// 3. hashSequence (32-byte hash)
// 4. outpoint (32-byte hash + 4-byte little endian)
// 5. scriptCode of the input (serialized as scripts inside CTxOuts)
// 6. value of the output spent by this input (8-byte little endian)
// 7. nSequence of the input (4-byte little endian)
// 8. hashOutputs (32-byte hash)
// 9. nLocktime of the transaction (4-byte little endian)
// 10. sighash type of the signature (4-byte little endian)
var segwitSerialization = function (data) {
    var currentInput = data.inputs[data.currentInputIndex];
    if (currentInput.scriptPubKey === "")
        throw "scriptPubkey must not be empty in transaction template";
    var scriptCode = wiz_data_1.default.fromHex(currentInput.scriptPubKey);
    if (currentInput.vout === "")
        throw "Vout must not be empty in transaction template";
    var vout = (0, convertion_1.numToLE32)(wiz_data_1.default.fromNumber(Number(currentInput.vout))).hex;
    if (currentInput.amount === "")
        throw "Amount must not be empty in transaction template";
    var inputAmount = (0, convertion_1.numToLE64)(wiz_data_1.default.fromNumber(Number(currentInput.amount) * 100000000)).hex;
    if (data.timelock === "")
        throw "Timelock must not be empty in transaction template";
    var timelock = (0, convertion_1.numToLE32)(wiz_data_1.default.fromNumber(Number(data.timelock))).hex;
    if (data.version === "")
        throw "Version must not be empty in transaction template";
    var version = (0, convertion_1.numToLE32)(wiz_data_1.default.fromNumber(Number(data.version))).hex;
    // 2 (32-byte hash)
    if (currentInput.previousTxId === "")
        throw "Previous TX ID must not be empty in transaction template";
    var hashPrevouts = calculatePrevouts(data.inputs);
    if (currentInput.sequence === "")
        throw "Sequence must not be empty in transaction template";
    var nsequence = (0, wiz_data_1.hexLE)(currentInput.sequence);
    // 3 (32-byte hash)
    var hashSequence = (0, crypto_1.hash256)(wiz_data_1.default.fromHex(nsequence)).toString();
    if (hashSequence === "")
        throw "Sequence must not be empty in transaction template";
    // 4. outpoint (32-byte hash + 4-byte little endian)
    var outpoint = (0, wiz_data_1.hexLE)(currentInput.previousTxId) + vout;
    if (outpoint === "")
        throw "Previous TX ID and Vout must not be empty in transaction template";
    // 5. script code hash
    var scriptCodeSize = (0, splices_1.size)(scriptCode).hex.substring(0, 2);
    if (scriptCodeSize === "")
        throw "scriptPubkey must not be empty in transaction template";
    // 8 hashOutputs
    var hashOutputs = calculateHashOutputs(data.outputs);
    return version + hashPrevouts + hashSequence + outpoint + scriptCodeSize + scriptCode.hex + inputAmount + nsequence + hashOutputs + timelock + "01000000";
};
exports.segwitSerialization = segwitSerialization;
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
var calculatePrevouts = function (inputs, isSegwit) {
    if (isSegwit === void 0) { isSegwit = true; }
    var hashInputs = "";
    inputs.forEach(function (input) {
        if (input.previousTxId === "" || input.vout === "")
            throw "Previous tx id and vout must not be empty";
        var vout = (0, convertion_1.numToLE32)(wiz_data_1.default.fromNumber(Number(input.vout))).hex;
        hashInputs += wiz_data_1.default.fromHex((0, wiz_data_1.hexLE)(input.previousTxId) + vout).hex;
    });
    console.log("hashInputs", hashInputs);
    return isSegwit ? (0, crypto_1.hash256)(wiz_data_1.default.fromHex(hashInputs)).toString() : (0, crypto_1.sha256)(wiz_data_1.default.fromHex(hashInputs)).toString();
};
var calculateInputAmounts = function (inputs) {
    var inputAmounts = "";
    inputs.forEach(function (input) {
        if (input.amount === "")
            throw "Input amounts must not be empty";
        inputAmounts += (0, convertion_1.numToLE64)(wiz_data_1.default.fromNumber(Number(input.amount) * 100000000)).hex;
    });
    return (0, crypto_1.sha256)(wiz_data_1.default.fromHex(inputAmounts)).toString();
};
var calculateInputScriptPubkeys = function (inputs) {
    var inputScriptPubkeys = "";
    inputs.forEach(function (input) {
        if (input.scriptPubKey === "")
            throw "Input script pubkey must not be empty";
        inputScriptPubkeys += (0, splices_1.size)(wiz_data_1.default.fromHex(input.scriptPubKey)).hex + input.scriptPubKey;
    });
    return (0, crypto_1.sha256)(wiz_data_1.default.fromHex(inputScriptPubkeys)).toString();
};
var calculateInputSequences = function (inputs) {
    var inputSequences = "";
    inputs.forEach(function (input) {
        if (input.sequence === "")
            throw "Input script sequence must not be empty";
        inputSequences += (0, wiz_data_1.hexLE)(input.sequence);
    });
    return (0, crypto_1.sha256)(wiz_data_1.default.fromHex(inputSequences)).toString();
};
var taprootSerialization = function (data, script, network) {
    var concat = "00";
    var sighashType = "00";
    if (data.version === "")
        throw "Version must not be empty in transaction template";
    var version = (0, convertion_1.numToLE32)(wiz_data_1.default.fromNumber(Number(data.version))).hex;
    console.log("version", version);
    if (data.timelock === "")
        throw "Timelock must not be empty in transaction template";
    var timelock = (0, convertion_1.numToLE32)(wiz_data_1.default.fromNumber(Number(data.timelock))).hex;
    console.log("timelock", timelock);
    var hashPrevouts = calculatePrevouts(data.inputs, false);
    console.log("hashPrevouts", hashPrevouts);
    var inputAmountsSha = calculateInputAmounts(data.inputs);
    console.log("inputAmountsSha", inputAmountsSha);
    var inputPubkeySha = calculateInputScriptPubkeys(data.inputs);
    console.log("inputPubkeySha", inputPubkeySha);
    var inputSequencesSha = calculateInputSequences(data.inputs);
    console.log("inputSequencesSha", inputSequencesSha);
    var outputs = calculateHashOutputs(data.outputs, false);
    console.log("outputs", outputs);
    var spendType = "02";
    var currentIndex = (0, convertion_1.numToLE32)(wiz_data_1.default.fromNumber(data.currentInputIndex)).hex;
    console.log("currentIndex", currentIndex);
    var tapleaf = (0, taproot_1.tapLeaf)(wiz_data_1.default.fromHex(script), network === model_1.VM_NETWORK.BTC ? "c0" : "c4");
    return (concat + sighashType + version + timelock + hashPrevouts + inputAmountsSha + inputPubkeySha + inputSequencesSha + outputs + spendType + currentIndex + tapleaf + "00ffffffff");
};
exports.taprootSerialization = taprootSerialization;
//# sourceMappingURL=serialization.js.map