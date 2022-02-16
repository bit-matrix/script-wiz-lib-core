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
exports.segwitSerialization = void 0;
var wiz_data_1 = __importStar(require("@script-wiz/wiz-data"));
var convertion_1 = require("./convertion");
var crypto_1 = require("./crypto");
var splices_1 = require("./splices");
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
    var scriptCode = wiz_data_1.default.fromHex(currentInput.scriptPubKey);
    var vout = (0, convertion_1.numToLE32)(wiz_data_1.default.fromNumber(Number(currentInput.vout))).hex;
    var inputAmount = (0, convertion_1.numToLE64)(wiz_data_1.default.fromNumber(Number(currentInput.amount) * 100000000)).hex;
    var timelock = (0, convertion_1.numToLE32)(wiz_data_1.default.fromNumber(Number(data.timelock))).hex;
    var version = (0, convertion_1.numToLE32)(wiz_data_1.default.fromNumber(Number(data.version))).hex;
    // 2 (32-byte hash)
    var hashPrevouts = (0, crypto_1.hash256)(wiz_data_1.default.fromHex((0, wiz_data_1.hexLE)(currentInput.previousTxId) + vout)).toString();
    var nsequence = (0, wiz_data_1.hexLE)(currentInput.sequence);
    // 3 (32-byte hash)
    var hashSequence = (0, crypto_1.hash256)(wiz_data_1.default.fromHex(nsequence)).toString();
    // 4. outpoint (32-byte hash + 4-byte little endian)
    var outpoint = (0, wiz_data_1.hexLE)(currentInput.previousTxId) + vout;
    // 5. script code hash
    var scriptCodeSize = (0, splices_1.size)(scriptCode).hex.substring(0, 2);
    // 8 hashOutputs
    var hashOutputs = calculateHashOutputs(data.outputs);
    return version + hashPrevouts + hashSequence + outpoint + scriptCodeSize + scriptCode.hex + inputAmount + nsequence + hashOutputs + timelock + "01000000";
};
exports.segwitSerialization = segwitSerialization;
var calculateHashOutputs = function (outputs) {
    var hashOutputs = "";
    outputs.forEach(function (output) {
        hashOutputs += (0, convertion_1.numToLE64)(wiz_data_1.default.fromNumber(Number(output.amount) * 100000000)).hex + (0, splices_1.size)(wiz_data_1.default.fromHex(output.scriptPubKey)).hex + output.scriptPubKey;
    });
    return (0, crypto_1.hash256)(wiz_data_1.default.fromHex(hashOutputs)).toString();
};
//# sourceMappingURL=serialization.js.map