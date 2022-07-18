"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicKeyToScriptPubkey = exports.compactSizeVarInt = exports.calculateTwoPow = exports.signdecimalToBinary = exports.toHexString = exports.flipbits = exports.NEGATIVE_1_64 = exports.MIN_INTEGER_64 = exports.MAX_INTEGER_64 = exports.ZERO_64 = void 0;
var wiz_data_1 = __importDefault(require("@script-wiz/wiz-data"));
var bn_js_1 = __importDefault(require("bn.js"));
var convertion_1 = require("../convertion");
var varuint_bitcoin_1 = __importDefault(require("varuint-bitcoin"));
var crypto_1 = require("../crypto");
exports.ZERO_64 = new bn_js_1.default((0, convertion_1.convert64)(wiz_data_1.default.fromHex("00")).bin, 2);
exports.MAX_INTEGER_64 = new bn_js_1.default("0111111111111111111111111111111111111111111111111111111111111111", 2);
exports.MIN_INTEGER_64 = new bn_js_1.default("1000000010000000000000000000000000000000000000000000000000000000", 2);
exports.NEGATIVE_1_64 = new bn_js_1.default("0000000000000000000000000000000000000000000000000000000010000001", 2);
var flipbits = function (str) {
    return str
        .split("")
        .map(function (b) { return (1 - b).toString(); })
        .join("");
};
exports.flipbits = flipbits;
var toHexString = function (byteArray) {
    return Array.from(byteArray, function (byte) {
        return ("0" + (byte & 0xff).toString(16)).slice(-2);
    }).join("");
};
exports.toHexString = toHexString;
var signdecimalToBinary = function (decimalValue) {
    return (decimalValue >>> 0).toString(2);
};
exports.signdecimalToBinary = signdecimalToBinary;
var calculateTwoPow = function (value) {
    var valueBin = (0, exports.signdecimalToBinary)(value);
    var valueBinArray = valueBin.split("");
    var isCurrent2 = valueBinArray.filter(function (arr) { return arr === "1"; });
    if (isCurrent2.length === 1) {
        return valueBinArray.length - 1;
    }
    return valueBinArray.length;
};
exports.calculateTwoPow = calculateTwoPow;
var compactSizeVarInt = function (hex) {
    var hexByteSize = hex.length / 2;
    return varuint_bitcoin_1.default.encode(hexByteSize).toString("hex");
};
exports.compactSizeVarInt = compactSizeVarInt;
var publicKeyToScriptPubkey = function (publickey) {
    var pubKeyHash = (0, crypto_1.sha256v2)(wiz_data_1.default.fromHex(publickey));
    var scriptPubkey = (0, crypto_1.ripemd160)(wiz_data_1.default.fromHex(pubKeyHash)).toString();
    return scriptPubkey;
};
exports.publicKeyToScriptPubkey = publicKeyToScriptPubkey;
//# sourceMappingURL=index.js.map