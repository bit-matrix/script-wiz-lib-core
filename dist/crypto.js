"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schnorrCreatePublicKey = exports.secp256k1CreatePublicKey = exports.secp256k1Verify = exports.schnorrSign = exports.secp256k1Sign = exports.schnorrKeyGenerator = exports.secp256k1KeyGenerator = exports.shnorrSigVerify = exports.tweakVerify = exports.checkMultiSig = exports.checkSig = exports.ecdsaVerify = exports.hash256 = exports.hash160v2 = exports.sha256v2 = exports.hash160 = exports.sha256 = exports.sha1 = exports.ripemd160 = void 0;
var crypto_js_1 = __importDefault(require("crypto-js"));
var elliptic_1 = __importDefault(require("elliptic"));
var bn_js_1 = __importDefault(require("bn.js"));
var wiz_data_1 = __importDefault(require("@script-wiz/wiz-data"));
var bcrypto_1 = __importDefault(require("bcrypto"));
var taproot_1 = require("./taproot");
var serialization_1 = require("./serialization");
// TO DO @afarukcali review
var ripemd160 = function (wizData) {
    return crypto_js_1.default.RIPEMD160(crypto_js_1.default.enc.Hex.parse(wizData.hex));
};
exports.ripemd160 = ripemd160;
var sha1 = function (wizData) {
    return crypto_js_1.default.SHA1(crypto_js_1.default.enc.Hex.parse(wizData.hex));
};
exports.sha1 = sha1;
var sha256 = function (wizData) {
    return crypto_js_1.default.SHA256(crypto_js_1.default.enc.Hex.parse(wizData.hex));
};
exports.sha256 = sha256;
var hash160 = function (wizData) {
    var dataWithSha256Hashed = crypto_js_1.default.SHA256(crypto_js_1.default.enc.Hex.parse(wizData.hex));
    var dataWithRipemd160Hashed = crypto_js_1.default.RIPEMD160(dataWithSha256Hashed);
    return dataWithRipemd160Hashed;
};
exports.hash160 = hash160;
var sha256v2 = function (wizData) {
    return crypto_js_1.default.SHA256(crypto_js_1.default.enc.Hex.parse(wizData.hex)).toString();
};
exports.sha256v2 = sha256v2;
var hash160v2 = function (wizData) {
    var dataWithSha256Hashed = crypto_js_1.default.SHA256(crypto_js_1.default.enc.Hex.parse(wizData.hex));
    var dataWithRipemd160Hashed = crypto_js_1.default.RIPEMD160(dataWithSha256Hashed);
    return dataWithRipemd160Hashed.toString();
};
exports.hash160v2 = hash160v2;
var hash256 = function (wizData) {
    var firstSHAHash = crypto_js_1.default.SHA256(crypto_js_1.default.enc.Hex.parse(wizData.hex));
    var secondSHAHash = crypto_js_1.default.SHA256(firstSHAHash);
    return secondSHAHash;
};
exports.hash256 = hash256;
var ecdsaVerify = function (sig, msg, pubkey) {
    var secp256k1 = new elliptic_1.default.ec("secp256k1");
    var hashedMessage = (0, exports.sha256)(msg).toString();
    var publicKey = pubkey.hex;
    var signature = sig.hex;
    if (publicKey.length !== 66)
        throw "ECDSA Verify error : invalid public key length";
    if (!signature.startsWith("30"))
        throw "ECDSA Verify error : signature must start with 0x30";
    var rAndSDataSize = Number("0x" + signature.substr(2, 2));
    var signatureStringLength = rAndSDataSize * 2 + 4;
    if (signature.length !== signatureStringLength)
        throw "ECDSA Verify error : signature length invalid";
    var rDataSize = Number("0x" + signature.substr(6, 2));
    var rValue = signature.substr(8, rDataSize * 2);
    var sDataSize = Number("0x" + signature.substr(10 + rDataSize * 2, 2));
    var sValue = signature.substr(10 + rDataSize * 2 + 2, sDataSize * 2);
    var rBn = new bn_js_1.default(rValue, "hex");
    var sBn = new bn_js_1.default(sValue, "hex");
    try {
        return wiz_data_1.default.fromNumber(secp256k1.verify(hashedMessage, { r: rBn, s: sBn }, secp256k1.keyFromPublic(publicKey, "hex")) ? 1 : 0);
    }
    catch (_a) {
        throw "ECDSA Verify error : something went wrong";
    }
};
exports.ecdsaVerify = ecdsaVerify;
var checkSig = function (wizData, wizData2, txTemplateData) {
    // stackData 1 = signature
    // stackData 2 = pubkey
    var message = (0, serialization_1.segwitSerialization)(txTemplateData);
    var hashedMessage = wiz_data_1.default.fromHex((0, exports.sha256)(wiz_data_1.default.fromHex(message)).toString());
    return (0, exports.ecdsaVerify)(wizData, hashedMessage, wizData2);
};
exports.checkSig = checkSig;
var checkMultiSig = function (publicKeyList, signatureList, txTemplateData) {
    var message = (0, serialization_1.segwitSerialization)(txTemplateData);
    var hashedMessage = wiz_data_1.default.fromHex((0, exports.sha256)(wiz_data_1.default.fromHex(message)).toString());
    var signResults = [];
    signatureList.forEach(function (signature) {
        publicKeyList.forEach(function (pk) {
            signResults.push((0, exports.ecdsaVerify)(signature, hashedMessage, pk));
        });
    });
    var confirmedSignaturesLength = signResults.filter(function (sr) { return sr.number === 1; }).length;
    return confirmedSignaturesLength === signatureList.length ? wiz_data_1.default.fromNumber(1) : wiz_data_1.default.fromNumber(0);
};
exports.checkMultiSig = checkMultiSig;
// taproot feature
var tweakVerify = function (wizData, wizData2, wizData3) {
    var internalKey = wizData3;
    var vchTweak = wizData2;
    var vchTweakedKey = wizData;
    if (vchTweak.bytes.length != 32)
        throw "Tweak key length must be eqaul 32 byte";
    if (internalKey.bytes.length != 32)
        throw "Internal key length must be eqaul 32 byte";
    if (vchTweakedKey.bytes[0] !== 2 && vchTweakedKey.bytes[0] !== 3)
        throw "Tweaked key must start with 0x02 or 0x03";
    var isChecked = (0, taproot_1.publicKeyTweakCheckWithPrefix)(internalKey, vchTweak, vchTweakedKey);
    return wiz_data_1.default.fromNumber(isChecked ? 1 : 0);
};
exports.tweakVerify = tweakVerify;
var shnorrSigVerify = function (sig, msg, pubkey) {
    if (pubkey.bytes.length !== 32)
        throw "Schnorr Verify error : invalid public key length";
    if (sig.bytes.length !== 64)
        throw "Schnorr Verify error : signature length must be equal 64 byte";
    var publicKey = Buffer.from(pubkey.hex, "hex");
    var signature = Buffer.from(sig.hex, "hex");
    var message = Buffer.from(msg.hex, "hex");
    try {
        return wiz_data_1.default.fromNumber(bcrypto_1.default.schnorr.verify(message, signature, publicKey) ? 1 : 0);
    }
    catch (_a) {
        throw "ECDSA Verify error : something went wrong";
    }
};
exports.shnorrSigVerify = shnorrSigVerify;
var secp256k1KeyGenerator = function () {
    var priKey = bcrypto_1.default.secp256k1.privateKeyGenerate();
    var pubKey = bcrypto_1.default.secp256k1.publicKeyCreate(priKey);
    var priKeyHex = priKey.toString("hex");
    var pubKeyHex = pubKey.toString("hex");
    var pubKeyAxis = bcrypto_1.default.secp256k1.publicKeyExport(pubKey);
    var xAxisHex = pubKeyAxis.x.toString("hex");
    var yAxisHex = pubKeyAxis.y.toString("hex");
    var uncompressedPubKey = "04" + xAxisHex + yAxisHex;
    return { privateKey: wiz_data_1.default.fromHex(priKeyHex), publicKey: wiz_data_1.default.fromHex(pubKeyHex), uncompressedPubKey: wiz_data_1.default.fromHex(uncompressedPubKey) };
};
exports.secp256k1KeyGenerator = secp256k1KeyGenerator;
var schnorrKeyGenerator = function () {
    var priKey = bcrypto_1.default.schnorr.privateKeyGenerate();
    var pubKey = bcrypto_1.default.schnorr.publicKeyCreate(priKey);
    var priKeyHex = priKey.toString("hex");
    var pubKeyHex = pubKey.toString("hex");
    var pubKeyAxis = bcrypto_1.default.schnorr.publicKeyExport(pubKey);
    var xAxisHex = pubKeyAxis.x.toString("hex");
    var yAxisHex = pubKeyAxis.y.toString("hex");
    var uncompressedPubKey = "04" + xAxisHex + yAxisHex;
    return { privateKey: wiz_data_1.default.fromHex(priKeyHex), publicKey: wiz_data_1.default.fromHex(pubKeyHex), uncompressedPubKey: wiz_data_1.default.fromHex(uncompressedPubKey) };
};
exports.schnorrKeyGenerator = schnorrKeyGenerator;
var secp256k1Sign = function (message, privateKey) {
    if (privateKey.bytes.length !== 32)
        throw "Private key byte length must be 32.";
    var bufferMessage = Buffer.from(message.hex, "hex");
    var bufferPrivateKey = Buffer.from(privateKey.hex, "hex");
    var sign;
    try {
        sign = bcrypto_1.default.secp256k1.sign(bufferMessage, bufferPrivateKey);
    }
    catch (err) {
        throw "invalid message";
    }
    var hexSign = sign.toString("hex");
    var derEncodeSign = bcrypto_1.default.secp256k1.signatureExport(sign);
    var derEncodeSignHex = derEncodeSign.toString("hex");
    return { sign: wiz_data_1.default.fromHex(hexSign), derEncodedSign: wiz_data_1.default.fromHex(derEncodeSignHex) };
};
exports.secp256k1Sign = secp256k1Sign;
var schnorrSign = function (message, privateKey) {
    if (privateKey.bytes.length !== 32)
        throw "Private key byte length must be 32.";
    var bufferMessage = Buffer.from(message.hex, "hex");
    var bufferPrivateKey = Buffer.from(privateKey.hex, "hex");
    //const aux = Buffer.from("ffffffffffffffffffffffffffffffff", "hex");
    var sign;
    try {
        sign = bcrypto_1.default.schnorr.sign(bufferMessage, bufferPrivateKey);
    }
    catch (err) {
        throw "invalid message";
    }
    var hexSign = sign.toString("hex");
    var derEncodeSign = bcrypto_1.default.secp256k1.signatureExport(sign);
    var derEncodeSignHex = derEncodeSign.toString("hex");
    return { sign: wiz_data_1.default.fromHex(hexSign), derEncodedSign: wiz_data_1.default.fromHex(derEncodeSignHex) };
};
exports.schnorrSign = schnorrSign;
var secp256k1Verify = function (message, signature, publicKey) {
    var bufferMessage = Buffer.from(message.hex, "hex");
    var bufferSignature = Buffer.from(signature.hex, "hex");
    var bufferPublicKey = Buffer.from(publicKey.hex, "hex");
    var verify = bcrypto_1.default.secp256k1.verify(bufferMessage, bufferSignature, bufferPublicKey);
    return wiz_data_1.default.fromNumber(verify ? 1 : 0);
};
exports.secp256k1Verify = secp256k1Verify;
var secp256k1CreatePublicKey = function (privateKey) {
    if (privateKey.bytes.length !== 32)
        throw "Private key byte length must be 32.";
    var pubKey;
    try {
        var privateKeyHex = Buffer.from(privateKey.hex, "hex");
        pubKey = bcrypto_1.default.secp256k1.publicKeyCreate(privateKeyHex);
    }
    catch (err) {
        throw "invalid private key";
    }
    var pubKeyHex = pubKey.toString("hex");
    var pubKeyAxis = bcrypto_1.default.secp256k1.publicKeyExport(pubKey);
    var xAxisHex = pubKeyAxis.x.toString("hex");
    var yAxisHex = pubKeyAxis.y.toString("hex");
    var uncompressedPubKey = "04" + xAxisHex + yAxisHex;
    return { privateKey: privateKey, publicKey: wiz_data_1.default.fromHex(pubKeyHex), uncompressedPubKey: wiz_data_1.default.fromHex(uncompressedPubKey) };
};
exports.secp256k1CreatePublicKey = secp256k1CreatePublicKey;
var schnorrCreatePublicKey = function (privateKey) {
    if (privateKey.bytes.length !== 32)
        throw "Private key byte length must be 32.";
    var pubKey;
    try {
        var privateKeyHex = Buffer.from(privateKey.hex, "hex");
        pubKey = bcrypto_1.default.schnorr.publicKeyCreate(privateKeyHex);
    }
    catch (err) {
        throw "invalid private key";
    }
    var pubKeyHex = pubKey.toString("hex");
    var pubKeyAxis = bcrypto_1.default.schnorr.publicKeyExport(pubKey);
    var xAxisHex = pubKeyAxis.x.toString("hex");
    var yAxisHex = pubKeyAxis.y.toString("hex");
    var uncompressedPubKey = "04" + xAxisHex + yAxisHex;
    return { privateKey: privateKey, publicKey: wiz_data_1.default.fromHex(pubKeyHex), uncompressedPubKey: wiz_data_1.default.fromHex(uncompressedPubKey) };
};
exports.schnorrCreatePublicKey = schnorrCreatePublicKey;
// const ECDSA = (messageHash: string, publicKey: string): string => {
//   const EC = elliptic.ec;
//   // Create and initialize EC context
//   // (better do it once and reuse it)
//   const ec = new EC("secp256k1");
//   // Generate keys
//   const key = ec.genKeyPair();
//   // Sign the message's hash (input must be an array, or a hex-string)
//   const signature = key.sign(messageHash);
//   // Export DER encoded signature in Array
//   const derSign = signature.toDER();
//   return derSign;
// };
//# sourceMappingURL=crypto.js.map