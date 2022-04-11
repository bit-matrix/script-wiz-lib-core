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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tapRoot = exports.treeHelper = exports.controlBlockCalculation = exports.tapLeaf = exports.tagHash = exports.publicKeyTweakCheckWithPrefix = exports.publicKeyTweakCheck = exports.tweakAdd = void 0;
var wiz_data_1 = __importDefault(require("@script-wiz/wiz-data"));
var crypto_1 = require("../crypto");
var utils_1 = require("../utils");
var segwit_addr = __importStar(require("../bech32/segwit_addr"));
var bcrypto_1 = __importDefault(require("bcrypto"));
var model_1 = require("../model");
var varuint_bitcoin_1 = __importDefault(require("varuint-bitcoin"));
var bn_js_1 = __importDefault(require("bn.js"));
// type TreeHelper = {
//   data: string;
//   h: string;
// };
var tweakAdd = function (pubkey, tweak) {
    if (pubkey.bytes.length !== 32) {
        throw "Pubkey length must be equal 32 byte";
    }
    var tweaked = wiz_data_1.default.fromHex(bcrypto_1.default.schnorr.publicKeyTweakAdd(Buffer.from(pubkey.hex, "hex"), Buffer.from(tweak.hex, "hex")).toString("hex"));
    return (0, exports.publicKeyTweakCheck)(pubkey, tweak, tweaked);
};
exports.tweakAdd = tweakAdd;
var publicKeyTweakCheck = function (pubkey, tweak, expect) {
    if (pubkey.bytes.length !== 32) {
        throw "Pubkey length must be equal 32 byte";
    }
    var isNegate = bcrypto_1.default.schnorr.publicKeyTweakCheck(Buffer.from(pubkey.hex, "hex"), Buffer.from(tweak.hex, "hex"), Buffer.from(expect.hex, "hex"), true);
    if (isNegate) {
        return wiz_data_1.default.fromHex("03" + expect.hex);
    }
    return wiz_data_1.default.fromHex("02" + expect.hex);
};
exports.publicKeyTweakCheck = publicKeyTweakCheck;
var publicKeyTweakCheckWithPrefix = function (pubkey, tweak, expect) {
    if (pubkey.bytes.length !== 32) {
        throw "Pubkey length must be equal 32 byte";
    }
    var expectKeyWithoutPrefix = expect.bytes.slice(1, expect.bytes.length);
    var expectKeyWithoutPrefixData = wiz_data_1.default.fromBytes(expectKeyWithoutPrefix);
    return bcrypto_1.default.schnorr.publicKeyTweakCheck(Buffer.from(pubkey.hex, "hex"), Buffer.from(tweak.hex, "hex"), Buffer.from(expectKeyWithoutPrefixData.hex, "hex"), expect.bytes[0] === 3);
};
exports.publicKeyTweakCheckWithPrefix = publicKeyTweakCheckWithPrefix;
var tagHash = function (tag, data) {
    var hashedTag = (0, crypto_1.sha256)(wiz_data_1.default.fromText(tag)).toString();
    hashedTag = hashedTag.concat(hashedTag);
    hashedTag = hashedTag.concat((0, utils_1.toHexString)(data.bytes));
    return (0, crypto_1.sha256)(wiz_data_1.default.fromHex(hashedTag)).toString();
};
exports.tagHash = tagHash;
var tapLeaf = function (script, version) {
    var leaftag = version === "c4" ? "TapLeaf/elements" : "TapLeaf";
    var scriptLength = varuint_bitcoin_1.default.encode(script.bytes.length).toString("hex");
    var scriptData = version + scriptLength + script.hex;
    var h = (0, exports.tagHash)(leaftag, wiz_data_1.default.fromHex(scriptData));
    return h;
};
exports.tapLeaf = tapLeaf;
var calculateTapBranch = function (tapLeaf1, tapLeaf2, version, nextLookup) {
    var tapBranchtag = version === "c4" ? "TapBranch/elements" : "TapBranch";
    var tapLeaf1Bn = new bn_js_1.default(tapLeaf1, "hex");
    var tapLeaf2Bn = new bn_js_1.default(tapLeaf2, "hex");
    var sibling;
    if (tapLeaf1 === nextLookup) {
        sibling = tapLeaf2;
    }
    if (tapLeaf2 === nextLookup) {
        sibling = tapLeaf1;
    }
    if (tapLeaf1Bn.gt(tapLeaf2Bn)) {
        return { tapBranchResult: wiz_data_1.default.fromHex((0, exports.tagHash)(tapBranchtag, wiz_data_1.default.fromHex(tapLeaf2.concat(tapLeaf1)))), sibling: sibling };
    }
    else {
        return { tapBranchResult: wiz_data_1.default.fromHex((0, exports.tagHash)(tapBranchtag, wiz_data_1.default.fromHex(tapLeaf1.concat(tapLeaf2)))), sibling: sibling };
    }
};
var controlBlockCalculation = function (scripts, version, innerkey, lookupLeafIndex) {
    var _a;
    var scriptLength = scripts.length;
    var leafGroupCount = (0, utils_1.calculateTwoPow)(scriptLength);
    var controlBlockArray = [];
    var tapBranchResults = [];
    if (scriptLength === 1) {
        tapBranchResults.push({ step: 0, data: wiz_data_1.default.fromHex((0, exports.tapLeaf)(scripts[0], version)) });
    }
    else {
        var nextLookup = (0, exports.tapLeaf)(scripts[lookupLeafIndex], version);
        var _loop_1 = function (i) {
            if (tapBranchResults.length > 0) {
                var filteredTapBranchResults = tapBranchResults.filter(function (tp) { return tp.step === i - 1; });
                // 2+ step
                for (var z = 0; z < filteredTapBranchResults.length; z += 2) {
                    if (z + 1 < filteredTapBranchResults.length) {
                        var calculatedTapBranchResult = calculateTapBranch(filteredTapBranchResults[z].data.hex, filteredTapBranchResults[z + 1].data.hex, version, nextLookup);
                        if (calculatedTapBranchResult.sibling) {
                            controlBlockArray.push(calculatedTapBranchResult.sibling);
                            nextLookup = calculatedTapBranchResult.tapBranchResult.hex;
                        }
                        tapBranchResults.push({
                            step: i,
                            data: calculatedTapBranchResult.tapBranchResult,
                        });
                    }
                    else {
                        tapBranchResults.push({ step: i, data: tapBranchResults[z].data });
                    }
                }
            }
            else {
                // 1. step
                for (var y = 0; y < scriptLength; y += 2) {
                    if (y + 1 < scriptLength) {
                        var tapLeaf1 = (0, exports.tapLeaf)(scripts[y], version);
                        var tapLeaf2 = (0, exports.tapLeaf)(scripts[y + 1], version);
                        var calculatedTapBranchResult = calculateTapBranch(tapLeaf1, tapLeaf2, version, nextLookup);
                        if (calculatedTapBranchResult.sibling) {
                            controlBlockArray.push(calculatedTapBranchResult.sibling);
                            nextLookup = calculatedTapBranchResult.tapBranchResult.hex;
                        }
                        tapBranchResults.push({ step: 1, data: calculatedTapBranchResult.tapBranchResult });
                    }
                    else {
                        tapBranchResults.push({ step: 1, data: wiz_data_1.default.fromHex((0, exports.tapLeaf)(scripts[y], version)) });
                    }
                }
            }
        };
        for (var i = 1; i <= leafGroupCount; i++) {
            _loop_1(i);
        }
    }
    var controlBlockFirstByte = "";
    var tag = version === "c4" ? "TapTweak/elements" : "TapTweak";
    var finalTweak = ((_a = tapBranchResults.find(function (tb) { return tb.step === leafGroupCount; })) === null || _a === void 0 ? void 0 : _a.data.hex) || "";
    var tweak = (0, exports.tagHash)(tag, wiz_data_1.default.fromHex(innerkey + finalTweak));
    var tweaked = (0, exports.tweakAdd)(wiz_data_1.default.fromHex(innerkey), wiz_data_1.default.fromHex(tweak));
    if (version === "c0") {
        if (tweaked.bytes[0].toString() === "2") {
            controlBlockFirstByte = "c0";
        }
        else {
            controlBlockFirstByte = "c1";
        }
    }
    else {
        if (tweaked.bytes[0].toString() === "2") {
            controlBlockFirstByte = "c4";
        }
        else {
            controlBlockFirstByte = "c5";
        }
    }
    return controlBlockFirstByte + innerkey + controlBlockArray.join("");
};
exports.controlBlockCalculation = controlBlockCalculation;
var treeHelper = function (scripts, version) {
    var scriptLength = scripts.length;
    var leafGroupCount = (0, utils_1.calculateTwoPow)(scriptLength);
    var tapBranchResults = [];
    if (scriptLength === 1) {
        return (0, exports.tapLeaf)(scripts[0], version);
    }
    else {
        var _loop_2 = function (i) {
            if (tapBranchResults.length > 0) {
                var filteredTapBranchResults = tapBranchResults.filter(function (tp) { return tp.step === i - 1; });
                // 2+ step
                for (var z = 0; z < filteredTapBranchResults.length; z += 2) {
                    if (z + 1 < filteredTapBranchResults.length) {
                        var calculatedTapBranchResult = calculateTapBranch(filteredTapBranchResults[z].data.hex, filteredTapBranchResults[z + 1].data.hex, version);
                        tapBranchResults.push({
                            step: i,
                            data: calculatedTapBranchResult.tapBranchResult,
                        });
                    }
                    else {
                        tapBranchResults.push({ step: i, data: tapBranchResults[z].data });
                    }
                }
            }
            else {
                // 1. step
                for (var y = 0; y < scriptLength; y += 2) {
                    if (y + 1 < scriptLength) {
                        var tapLeaf1 = (0, exports.tapLeaf)(scripts[y], version);
                        var tapLeaf2 = (0, exports.tapLeaf)(scripts[y + 1], version);
                        var calculatedTapBranchResult = calculateTapBranch(tapLeaf1, tapLeaf2, version);
                        tapBranchResults.push({ step: 1, data: calculatedTapBranchResult.tapBranchResult });
                    }
                    else {
                        tapBranchResults.push({ step: 1, data: wiz_data_1.default.fromHex((0, exports.tapLeaf)(scripts[y], version)) });
                    }
                }
            }
        };
        for (var i = 1; i <= leafGroupCount; i++) {
            _loop_2(i);
        }
    }
    var finalResult = tapBranchResults.find(function (tb) { return tb.step === leafGroupCount; });
    if (finalResult) {
        return finalResult.data.hex;
    }
    return "";
};
exports.treeHelper = treeHelper;
// export const getVersionTaggedPubKey = (pubkey: WizData): WizData => {
//   const logic = pubkey.bytes[0] & 1;
//   console.log("logic", logic);
//   if (logic === 1) {
//     return WizData.fromHex("00");
//   }
//   return WizData.fromNumber(1);
// };
var tapRoot = function (pubKey, scripts, taprootVersion) {
    var version = taprootVersion === model_1.TAPROOT_VERSION.LIQUID ? "c4" : "c0";
    var tag = taprootVersion === model_1.TAPROOT_VERSION.LIQUID ? "TapTweak/elements" : "TapTweak";
    var h = (0, exports.treeHelper)(scripts, version);
    console.log("tap leaf result", h);
    var tweak = (0, exports.tagHash)(tag, wiz_data_1.default.fromHex(pubKey.hex + h));
    console.log("tap tweak result", tweak);
    var tweaked = (0, exports.tweakAdd)(pubKey, wiz_data_1.default.fromHex(tweak));
    console.log("tap tweaked result:", tweaked.hex);
    var finalTweaked = tweaked.hex.substr(2);
    console.log("final tweaked", finalTweaked);
    var op1Hex = "51";
    var testnetAddress = "";
    var mainnetAddress = "";
    if (taprootVersion === model_1.TAPROOT_VERSION.BITCOIN) {
        testnetAddress = segwit_addr.encode("tb", 1, wiz_data_1.default.fromHex(finalTweaked).bytes) || "";
        mainnetAddress = segwit_addr.encode("bc", 1, wiz_data_1.default.fromHex(finalTweaked).bytes) || "";
    }
    else {
        testnetAddress = segwit_addr.encode("tex", 1, wiz_data_1.default.fromHex(finalTweaked).bytes) || "";
        mainnetAddress = segwit_addr.encode("ex", 1, wiz_data_1.default.fromHex(finalTweaked).bytes) || "";
    }
    var scriptPubkey = wiz_data_1.default.fromHex(op1Hex + wiz_data_1.default.fromNumber(finalTweaked.length / 2).hex + finalTweaked);
    console.log("script pub key", scriptPubkey.hex);
    return { scriptPubkey: scriptPubkey, tweak: tweaked, address: { testnet: testnetAddress, mainnet: mainnetAddress } };
};
exports.tapRoot = tapRoot;
//# sourceMappingURL=index.js.map