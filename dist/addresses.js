"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBech32Address = void 0;
var bech32_1 = require("bech32");
var crypto_1 = require("./crypto");
// version 0 -> segwit
// version 1 -> taproot
// prefix bc -> bitcoin mainnet
// prefix tb -> bitcoin testnet
var createBech32Address = function (data, prefix, version) {
    var hashedData = (0, crypto_1.sha256)(data).toString();
    var words = bech32_1.bech32.toWords(Buffer.from(hashedData, "hex"));
    words.unshift(version);
    var address = version === 0 ? bech32_1.bech32.encode(prefix, words) : bech32_1.bech32m.encode(prefix, words);
    return address;
};
exports.createBech32Address = createBech32Address;
//# sourceMappingURL=addresses.js.map