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
var serializationutils_1 = require("./utils/serializationutils");
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
var segwitSerialization = function (data, sighashType, codeSeperator) {
    switch (sighashType) {
        case crypto_1.SIGHASH_TYPE.SIGHASH_ALL:
            return sighashAll(data, codeSeperator);
        case crypto_1.SIGHASH_TYPE.SIGHASH_SINGLE:
            return sighashSingle(data, codeSeperator);
        case crypto_1.SIGHASH_TYPE.SIGHASH_NONE:
            return sighashNone(data, codeSeperator);
        case crypto_1.SIGHASH_TYPE.SIGHASH_ANYONECANPAY:
            return sighashAnyonecanpay(data, codeSeperator);
        default:
            return sighashAll(data, codeSeperator);
    }
};
exports.segwitSerialization = segwitSerialization;
var taprootSerialization = function (data, script, network, sighashType, codeSeperator) {
    switch (sighashType) {
        case crypto_1.SIGHASH_TYPE.SIGHASH_ALL:
            return sighashAllT(data, script, network, codeSeperator);
        case crypto_1.SIGHASH_TYPE.SIGHASH_SINGLE:
            return sighashSingleT(data, script, network, codeSeperator);
        case crypto_1.SIGHASH_TYPE.SIGHASH_ANYONECANPAY:
            return sighashAnyonecanpayT(data, script, network, codeSeperator);
        case crypto_1.SIGHASH_TYPE.SIGHASH_NONE:
            return sighashNoneT(data, script, network, codeSeperator);
        default:
            return sighashAllT(data, script, network, codeSeperator);
    }
};
exports.taprootSerialization = taprootSerialization;
var sighashAll = function (data, codeSeperator) {
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
    var hashPrevouts = (0, serializationutils_1.calculatePrevouts)(data.inputs);
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
    var hashOutputs = (0, serializationutils_1.calculateHashOutputs)(data.outputs);
    return version + hashPrevouts + hashSequence + outpoint + scriptCodeSize + scriptCode.hex + inputAmount + nsequence + hashOutputs + timelock + "01" + codeSeperator !== ""
        ? (0, convertion_1.convert32)(wiz_data_1.default.fromHex(codeSeperator)).hex
        : "ffffffff";
};
var sighashSingle = function (data, codeSeperator) {
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
    var hashPrevouts = (0, serializationutils_1.calculatePrevouts)(data.inputs);
    if (currentInput.sequence === "")
        throw "Sequence must not be empty in transaction template";
    var nsequence = (0, wiz_data_1.hexLE)(currentInput.sequence);
    // 3 (32-byte hash)
    var hashSequence = serializationutils_1.emptyUnit;
    // 4. outpoint (32-byte hash + 4-byte little endian)
    var outpoint = (0, wiz_data_1.hexLE)(currentInput.previousTxId) + vout;
    if (outpoint === "")
        throw "Previous TX ID and Vout must not be empty in transaction template";
    // 5. script code hash
    var scriptCodeSize = (0, splices_1.size)(scriptCode).hex.substring(0, 2);
    if (scriptCodeSize === "")
        throw "scriptPubkey must not be empty in transaction template";
    var hashOutputs = serializationutils_1.emptyUnit;
    if (data.currentInputIndex < data.outputs.length)
        hashOutputs = (0, serializationutils_1.calculateHashOutputs)([data.outputs[data.currentInputIndex]]);
    return version + hashPrevouts + hashSequence + outpoint + scriptCodeSize + scriptCode.hex + inputAmount + nsequence + hashOutputs + timelock + "01" + codeSeperator !== ""
        ? (0, convertion_1.convert32)(wiz_data_1.default.fromHex(codeSeperator)).hex
        : "ffffffff";
};
var sighashNone = function (data, codeSeperator) {
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
    var hashPrevouts = (0, serializationutils_1.calculatePrevouts)(data.inputs);
    if (currentInput.sequence === "")
        throw "Sequence must not be empty in transaction template";
    var nsequence = (0, wiz_data_1.hexLE)(currentInput.sequence);
    // 3 (32-byte hash)
    var hashSequence = serializationutils_1.emptyUnit;
    // 4. outpoint (32-byte hash + 4-byte little endian)
    var outpoint = (0, wiz_data_1.hexLE)(currentInput.previousTxId) + vout;
    if (outpoint === "")
        throw "Previous TX ID and Vout must not be empty in transaction template";
    // 5. script code hash
    var scriptCodeSize = (0, splices_1.size)(scriptCode).hex.substring(0, 2);
    if (scriptCodeSize === "")
        throw "scriptPubkey must not be empty in transaction template";
    return version + hashPrevouts + hashSequence + outpoint + scriptCodeSize + scriptCode.hex + inputAmount + nsequence + timelock + "01" + codeSeperator !== ""
        ? (0, convertion_1.convert32)(wiz_data_1.default.fromHex(codeSeperator)).hex
        : "ffffffff";
};
var sighashAnyonecanpay = function (data, codeSeperator) {
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
    var hashPrevouts = serializationutils_1.emptyUnit;
    if (currentInput.sequence === "")
        throw "Sequence must not be empty in transaction template";
    var nsequence = (0, wiz_data_1.hexLE)(currentInput.sequence);
    // 3 (32-byte hash)
    var hashSequence = serializationutils_1.emptyUnit;
    // 4. outpoint (32-byte hash + 4-byte little endian)
    var outpoint = (0, wiz_data_1.hexLE)(currentInput.previousTxId) + vout;
    if (outpoint === "")
        throw "Previous TX ID and Vout must not be empty in transaction template";
    // 5. script code hash
    var scriptCodeSize = (0, splices_1.size)(scriptCode).hex.substring(0, 2);
    if (scriptCodeSize === "")
        throw "scriptPubkey must not be empty in transaction template";
    // 8 hashOutputs
    var hashOutputs = (0, serializationutils_1.calculateHashOutputs)(data.outputs);
    return version + hashPrevouts + hashSequence + outpoint + scriptCodeSize + scriptCode.hex + inputAmount + nsequence + hashOutputs + timelock + "01" + codeSeperator !== ""
        ? (0, convertion_1.convert32)(wiz_data_1.default.fromHex(codeSeperator)).hex
        : "ffffffff";
};
var sighashAllT = function (data, script, network, codeSeperator) {
    var concat = "00";
    if (data.version === "")
        throw "Version must not be empty in transaction template";
    var version = (0, convertion_1.numToLE32)(wiz_data_1.default.fromNumber(Number(data.version))).hex;
    if (data.timelock === "")
        throw "Timelock must not be empty in transaction template";
    var timelock = (0, convertion_1.numToLE32)(wiz_data_1.default.fromNumber(Number(data.timelock))).hex;
    var hashPrevouts = (0, serializationutils_1.calculatePrevouts)(data.inputs, false);
    var inputAmountsSha = (0, serializationutils_1.calculateInputAmounts)(data.inputs);
    var inputPubkeySha = (0, serializationutils_1.calculateInputScriptPubkeys)(data.inputs);
    var inputSequencesSha = (0, serializationutils_1.calculateInputSequences)(data.inputs);
    var spendType = "02";
    var currentIndex = (0, convertion_1.numToLE32)(wiz_data_1.default.fromNumber(data.currentInputIndex)).hex;
    var tapleaf = (0, taproot_1.tapLeaf)(wiz_data_1.default.fromHex(script), network === model_1.VM_NETWORK.BTC ? "c0" : "c4");
    var outputs = (0, serializationutils_1.calculateHashOutputs)(data.outputs, false);
    return concat +
        crypto_1.SIGHASH_TYPE.SIGHASH_ALL +
        version +
        timelock +
        hashPrevouts +
        inputAmountsSha +
        inputPubkeySha +
        inputSequencesSha +
        outputs +
        spendType +
        currentIndex +
        tapleaf +
        "00" +
        codeSeperator !==
        ""
        ? (0, convertion_1.convert32)(wiz_data_1.default.fromHex(codeSeperator)).hex
        : "ffffffff";
};
var sighashSingleT = function (data, script, network, codeSeperator) {
    var concat = "00";
    if (data.version === "")
        throw "Version must not be empty in transaction template";
    var version = (0, convertion_1.numToLE32)(wiz_data_1.default.fromNumber(Number(data.version))).hex;
    if (data.timelock === "")
        throw "Timelock must not be empty in transaction template";
    var timelock = (0, convertion_1.numToLE32)(wiz_data_1.default.fromNumber(Number(data.timelock))).hex;
    var hashPrevouts = (0, serializationutils_1.calculatePrevouts)(data.inputs, false);
    var inputAmountsSha = (0, serializationutils_1.calculateInputAmounts)(data.inputs);
    var inputPubkeySha = (0, serializationutils_1.calculateInputScriptPubkeys)(data.inputs);
    var inputSequencesSha = (0, serializationutils_1.calculateInputSequences)(data.inputs);
    var spendType = "02";
    var currentIndex = (0, convertion_1.numToLE32)(wiz_data_1.default.fromNumber(data.currentInputIndex)).hex;
    var tapleaf = (0, taproot_1.tapLeaf)(wiz_data_1.default.fromHex(script), network === model_1.VM_NETWORK.BTC ? "c0" : "c4");
    var outputs = (0, serializationutils_1.calculateHashOutputs)([data.outputs[data.currentInputIndex]], false);
    return concat +
        crypto_1.SIGHASH_TYPE.SIGHASH_SINGLE +
        version +
        timelock +
        hashPrevouts +
        inputAmountsSha +
        inputPubkeySha +
        inputSequencesSha +
        outputs +
        spendType +
        currentIndex +
        tapleaf +
        "00" +
        codeSeperator !==
        ""
        ? (0, convertion_1.convert32)(wiz_data_1.default.fromHex(codeSeperator)).hex
        : "ffffffff";
};
var sighashAnyonecanpayT = function (data, script, network, codeSeperator) {
    var concat = "00";
    if (data.version === "")
        throw "Version must not be empty in transaction template";
    var version = (0, convertion_1.numToLE32)(wiz_data_1.default.fromNumber(Number(data.version))).hex;
    if (data.timelock === "")
        throw "Timelock must not be empty in transaction template";
    var timelock = (0, convertion_1.numToLE32)(wiz_data_1.default.fromNumber(Number(data.timelock))).hex;
    var currentInput = data.inputs[data.currentInputIndex];
    var outpoint = currentInput.previousTxId + currentInput.vout;
    var amount = (0, convertion_1.numToLE64)(wiz_data_1.default.fromNumber(Number(currentInput.amount) * 100000000)).hex;
    var nSequence = (0, wiz_data_1.hexLE)(currentInput.sequence);
    var spendType = "02";
    var currentIndex = (0, convertion_1.numToLE32)(wiz_data_1.default.fromNumber(data.currentInputIndex)).hex;
    var tapleaf = (0, taproot_1.tapLeaf)(wiz_data_1.default.fromHex(script), network === model_1.VM_NETWORK.BTC ? "c0" : "c4");
    var outputs = (0, serializationutils_1.calculateHashOutputs)([data.outputs[data.currentInputIndex]], false);
    return concat +
        crypto_1.SIGHASH_TYPE.SIGHASH_ANYONECANPAY +
        version +
        timelock +
        spendType +
        outpoint +
        amount +
        currentInput.scriptPubKey +
        nSequence +
        outputs +
        currentIndex +
        tapleaf +
        "00" +
        codeSeperator !==
        ""
        ? (0, convertion_1.convert32)(wiz_data_1.default.fromHex(codeSeperator)).hex
        : "ffffffff";
};
var sighashNoneT = function (data, script, network, codeSeperator) {
    var concat = "00";
    if (data.version === "")
        throw "Version must not be empty in transaction template";
    var version = (0, convertion_1.numToLE32)(wiz_data_1.default.fromNumber(Number(data.version))).hex;
    if (data.timelock === "")
        throw "Timelock must not be empty in transaction template";
    var timelock = (0, convertion_1.numToLE32)(wiz_data_1.default.fromNumber(Number(data.timelock))).hex;
    var hashPrevouts = (0, serializationutils_1.calculatePrevouts)(data.inputs, false);
    var inputAmountsSha = (0, serializationutils_1.calculateInputAmounts)(data.inputs);
    var inputPubkeySha = (0, serializationutils_1.calculateInputScriptPubkeys)(data.inputs);
    var inputSequencesSha = (0, serializationutils_1.calculateInputSequences)(data.inputs);
    var spendType = "02";
    var currentIndex = (0, convertion_1.numToLE32)(wiz_data_1.default.fromNumber(data.currentInputIndex)).hex;
    var tapleaf = (0, taproot_1.tapLeaf)(wiz_data_1.default.fromHex(script), network === model_1.VM_NETWORK.BTC ? "c0" : "c4");
    return concat +
        crypto_1.SIGHASH_TYPE.SIGHASH_SINGLE +
        version +
        timelock +
        hashPrevouts +
        inputAmountsSha +
        inputPubkeySha +
        inputSequencesSha +
        spendType +
        currentIndex +
        tapleaf +
        "00" +
        codeSeperator !==
        ""
        ? (0, convertion_1.convert32)(wiz_data_1.default.fromHex(codeSeperator)).hex
        : "ffffffff";
};
//# sourceMappingURL=serialization.js.map