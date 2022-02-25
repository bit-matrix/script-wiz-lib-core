"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.inspectOutputScriptPubKey = exports.inspectOutputNonce = exports.inspectOutputValue = exports.inspectOutputAsset = exports.inspectInputSequence = exports.inspectInputIssuance = exports.inspectInputScriptPubKey = exports.inspectInputValue = exports.inspectInputAsset = exports.inspectInputOutPoint = void 0;
var wiz_data_1 = __importStar(require("@script-wiz/wiz-data"));
var crypto = __importStar(require("./crypto"));
var convertion_1 = require("./convertion");
var inspectInputOutPoint = function (wizData, txInputs) {
    var currentTxInputIndex = wizData.number;
    if (wizData.hex === "00") {
        currentTxInputIndex = 0;
    }
    var txInputLength = txInputs.length;
    if (currentTxInputIndex === undefined)
        throw "Invalid transaction input index!";
    if (currentTxInputIndex < 0)
        throw "Invalid transaction input index must at least zero!";
    if (txInputLength === 0)
        throw "Transaction input template must include at least an element.";
    if (txInputLength < currentTxInputIndex + 1)
        throw "Input index must less than transaction inputs length!";
    var currentInputPreviousTxId = txInputs[currentTxInputIndex].previousTxId;
    var currentInputVout = (0, convertion_1.numToLE32)(wiz_data_1.default.fromNumber(Number(txInputs[currentTxInputIndex].vout))).hex;
    if (!currentInputPreviousTxId)
        throw "Previous Tx Id not found! Check your transaction template.";
    if (!currentInputVout)
        throw "Vout not found! Check your transaction template.";
    var inputPreviousTxIdLE = Buffer.from(currentInputPreviousTxId, "hex").reverse().toString("hex");
    return [wiz_data_1.default.fromHex(inputPreviousTxIdLE), wiz_data_1.default.fromHex(currentInputVout), wiz_data_1.default.fromHex("00")];
};
exports.inspectInputOutPoint = inspectInputOutPoint;
var inspectInputAsset = function (wizData, txInputs) {
    var currentTxInputIndex = wizData.number;
    if (wizData.hex === "00") {
        currentTxInputIndex = 0;
    }
    var txInputLength = txInputs.length;
    if (currentTxInputIndex === undefined)
        throw "Invalid transaction input index!";
    if (currentTxInputIndex < 0)
        throw "Invalid transaction input index must at least zero!";
    if (txInputLength === 0)
        throw "Transaction input template must include at least an element.";
    //   const txInputIndex = currentTxInputIndex - 1;
    if (txInputLength < currentTxInputIndex + 1)
        throw "Input index must less than transaction inputs length!";
    var currentInputAssetId = txInputs[currentTxInputIndex].assetId;
    if (!currentInputAssetId)
        throw "Asset id not found! Check your transaction template.";
    var inputAssetIdLE = Buffer.from(currentInputAssetId, "hex").reverse().toString("hex");
    return [wiz_data_1.default.fromHex(inputAssetIdLE), wiz_data_1.default.fromNumber(1)];
};
exports.inspectInputAsset = inspectInputAsset;
var inspectInputValue = function (wizData, txInputs) {
    var currentTxInputIndex = wizData.number;
    if (wizData.hex === "00") {
        currentTxInputIndex = 0;
    }
    var txInputLength = txInputs.length;
    if (currentTxInputIndex === undefined)
        throw "Invalid transaction input index!";
    if (currentTxInputIndex < 0)
        throw "Invalid transaction input index must at least zero!";
    if (txInputLength === 0)
        throw "Transaction input template must include at least an element.";
    if (txInputLength < currentTxInputIndex + 1)
        throw "Input index must less than transaction inputs length!";
    var currentInputAmount = (0, convertion_1.numToLE64)(wiz_data_1.default.fromNumber(Number(txInputs[currentTxInputIndex].amount) * 100000000)).hex;
    if (!currentInputAmount)
        throw "Amount not found! Check your transaction template.";
    return [wiz_data_1.default.fromHex(currentInputAmount), wiz_data_1.default.fromNumber(1)];
};
exports.inspectInputValue = inspectInputValue;
var inspectInputScriptPubKey = function (wizData, txInputs) {
    var currentTxInputIndex = wizData.number;
    if (wizData.hex === "00") {
        currentTxInputIndex = 0;
    }
    var txInputLength = txInputs.length;
    if (currentTxInputIndex === undefined)
        throw "Invalid transaction input index!";
    if (currentTxInputIndex < 0)
        throw "Invalid transaction input index must at least zero!";
    if (txInputLength === 0)
        throw "Transaction input template must include at least an element.";
    if (txInputLength < currentTxInputIndex + 1)
        throw "Input index must less than transaction inputs length!";
    if (!txInputs[currentTxInputIndex].scriptPubKey) {
        var emptyScriptPupKeyHash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
        return [wiz_data_1.default.fromHex(emptyScriptPupKeyHash), wiz_data_1.default.fromNumber(-1)];
    }
    else {
        var currentScriptPubKey = txInputs[currentTxInputIndex].scriptPubKey;
        var witnessVersion = currentScriptPubKey.substr(0, 2);
        var witnessProgram = currentScriptPubKey.substring(4);
        var witnessProgramLength = wiz_data_1.default.fromHex(witnessProgram).bytes.length;
        var result = [];
        // Segwit (v0): first byte = 0, witnessProgram length 32 or 20 byte
        if (witnessVersion === "00" && (witnessProgramLength === 20 || witnessProgramLength === 32)) {
            result = [wiz_data_1.default.fromHex(witnessProgram), wiz_data_1.default.fromNumber(0)];
            // Taproot (v1):first byte = 51, witnessProgram length 32 byte
        }
        else if (witnessVersion === "51" && witnessProgramLength === 32) {
            result = [wiz_data_1.default.fromHex(witnessProgram), wiz_data_1.default.fromNumber(1)];
        }
        else {
            // Legacy: none segwit and none taproot
            var pubKeySha256 = crypto.sha256(wiz_data_1.default.fromHex(currentScriptPubKey)).toString();
            result = [wiz_data_1.default.fromHex(pubKeySha256), wiz_data_1.default.fromNumber(-1)];
        }
        return result;
    }
};
exports.inspectInputScriptPubKey = inspectInputScriptPubKey;
var inspectInputIssuance = function (wizData, txInputs) {
    var currentTxInputIndex = wizData.number;
    if (wizData.hex === "00") {
        currentTxInputIndex = 0;
    }
    var txInputLength = txInputs.length;
    if (currentTxInputIndex === undefined)
        throw "Invalid transaction input index!";
    if (currentTxInputIndex < 0)
        throw "Invalid transaction input index must at least zero!";
    if (txInputLength === 0)
        throw "Transaction input template must include at least an element.";
    if (txInputLength < currentTxInputIndex + 1)
        throw "Input index must less than transaction inputs length!";
    return wiz_data_1.default.fromNumber(0);
};
exports.inspectInputIssuance = inspectInputIssuance;
var inspectInputSequence = function (wizData, txInputs) {
    var currentTxInputIndex = wizData.number;
    if (wizData.hex === "00") {
        currentTxInputIndex = 0;
    }
    var txInputLength = txInputs.length;
    if (currentTxInputIndex === undefined)
        throw "Invalid transaction input index!";
    if (currentTxInputIndex < 0)
        throw "Invalid transaction input index must at least zero!";
    if (txInputLength === 0)
        throw "Transaction input template must include at least an element.";
    if (txInputLength < currentTxInputIndex + 1)
        throw "Input index must less than transaction inputs length!";
    var currentInputSequence = (0, wiz_data_1.hexLE)(txInputs[currentTxInputIndex].sequence);
    if (!currentInputSequence)
        throw "Sequence not found! Check your transaction template.";
    return wiz_data_1.default.fromHex(currentInputSequence);
};
exports.inspectInputSequence = inspectInputSequence;
var inspectOutputAsset = function (wizData, txOutputs) {
    var currentTxOutputIndex = wizData.number;
    if (wizData.hex === "00") {
        currentTxOutputIndex = 0;
    }
    var txOutputLength = txOutputs.length;
    if (currentTxOutputIndex === undefined)
        throw "Invalid transaction output index!";
    if (currentTxOutputIndex < 0)
        throw "Invalid transaction output index must at least zero!";
    if (txOutputLength === 0)
        throw "Transaction output template must include at least an element.";
    if (txOutputLength < currentTxOutputIndex + 1)
        throw "Output index must less than transaction outputs length!";
    var currentOutputAssetId = txOutputs[currentTxOutputIndex].assetId;
    if (!currentOutputAssetId)
        throw "Output Asset id not found! Check your transaction template.";
    var outputAssetIdLE = Buffer.from(currentOutputAssetId, "hex").reverse().toString("hex");
    return [wiz_data_1.default.fromHex(outputAssetIdLE), wiz_data_1.default.fromNumber(1)];
};
exports.inspectOutputAsset = inspectOutputAsset;
var inspectOutputValue = function (wizData, txOutputs) {
    var currentTxOutputIndex = wizData.number;
    if (wizData.hex === "00") {
        currentTxOutputIndex = 0;
    }
    var txOutputLength = txOutputs.length;
    if (currentTxOutputIndex === undefined)
        throw "Invalid transaction output index!";
    if (currentTxOutputIndex < 0)
        throw "Invalid transaction output index must at least zero!";
    if (txOutputLength === 0)
        throw "Transaction output template must include at least an element.";
    if (txOutputLength < currentTxOutputIndex + 1)
        throw "Output index must less than transaction outputs length!";
    var currentOutputAmount = (0, convertion_1.numToLE64)(wiz_data_1.default.fromNumber(Number(txOutputs[currentTxOutputIndex].amount) * 100000000)).hex;
    if (!currentOutputAmount)
        throw "Amount not found! Check your transaction template.";
    return [wiz_data_1.default.fromHex(currentOutputAmount), wiz_data_1.default.fromNumber(1)];
};
exports.inspectOutputValue = inspectOutputValue;
var inspectOutputNonce = function (wizData, txOutputs) {
    var currentTxOutputIndex = wizData.number;
    if (wizData.hex === "00") {
        currentTxOutputIndex = 0;
    }
    var txOutputLength = txOutputs.length;
    if (currentTxOutputIndex === undefined)
        throw "Invalid transaction output index!";
    if (currentTxOutputIndex < 0)
        throw "Invalid transaction output index must at least zero!";
    if (txOutputLength === 0)
        throw "Transaction output template must include at least an element.";
    if (txOutputLength < currentTxOutputIndex + 1)
        throw "Output index must less than transaction outputs length!";
    return wiz_data_1.default.fromNumber(0);
};
exports.inspectOutputNonce = inspectOutputNonce;
var inspectOutputScriptPubKey = function (wizData, txOutputs) {
    var currentTxOutputIndex = wizData.number;
    if (wizData.hex === "00") {
        currentTxOutputIndex = 0;
    }
    var txOutputLength = txOutputs.length;
    if (currentTxOutputIndex === undefined)
        throw "Invalid transaction output index!";
    if (currentTxOutputIndex < 0)
        throw "Invalid transaction output index must at least zero!";
    if (txOutputLength === 0)
        throw "Transaction output template must include at least an element.";
    if (txOutputLength < currentTxOutputIndex + 1)
        throw "Output index must less than transaction outputs length!";
    if (!txOutputs[currentTxOutputIndex].scriptPubKey) {
        var emptyScriptPupKeyHash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
        return [wiz_data_1.default.fromHex(emptyScriptPupKeyHash), wiz_data_1.default.fromNumber(-1)];
    }
    else {
        var currentScriptPubKey = txOutputs[currentTxOutputIndex].scriptPubKey;
        var witnessVersion = currentScriptPubKey.substr(0, 2);
        var witnessProgram = currentScriptPubKey.substring(4);
        var witnessProgramLength = wiz_data_1.default.fromHex(witnessProgram).bytes.length;
        var result = [];
        // Segwit (v0): first byte = 0, witnessProgram length 32 or 20 byte
        if (witnessVersion === "00" && (witnessProgramLength === 20 || witnessProgramLength === 32)) {
            result = [wiz_data_1.default.fromHex(witnessProgram), wiz_data_1.default.fromNumber(0)];
            // Taproot (v1):first byte = 51, witnessProgram length 32 byte
        }
        else if (witnessVersion === "51" && witnessProgramLength === 32) {
            result = [wiz_data_1.default.fromHex(witnessProgram), wiz_data_1.default.fromNumber(1)];
        }
        else {
            // Legacy: none segwit and none taproot
            var pubKeySha256 = crypto.sha256(wiz_data_1.default.fromHex(currentScriptPubKey)).toString();
            result = [wiz_data_1.default.fromHex(pubKeySha256), wiz_data_1.default.fromNumber(-1)];
        }
        return result;
    }
};
exports.inspectOutputScriptPubKey = inspectOutputScriptPubKey;
//# sourceMappingURL=introspection.js.map