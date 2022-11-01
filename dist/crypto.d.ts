import CryptoJS from "crypto-js";
import WizData from "@script-wiz/wiz-data";
import { TxData } from "./model";
import { VM } from "./taproot/model";
export declare enum SIGHASH_TYPE {
    SIGHASH_ALL = "01",
    SIGHASH_NONE = "02",
    SIGHASH_SINGLE = "03",
    SIGHASH_ANYONECANPAY = "80"
}
export declare const ripemd160: (wizData: WizData) => CryptoJS.lib.WordArray;
export declare const sha1: (wizData: WizData) => CryptoJS.lib.WordArray;
export declare const sha256: (wizData: WizData) => CryptoJS.lib.WordArray;
export declare const hash160: (wizData: WizData) => CryptoJS.lib.WordArray;
export declare const sha256v2: (wizData: WizData) => string;
export declare const hash160v2: (wizData: WizData) => string;
export declare const hash256: (wizData: WizData) => CryptoJS.lib.WordArray;
export declare const ecdsaVerify: (sig: WizData, msg: WizData, pubkey: WizData) => WizData;
export declare const checkSig: (wizData: WizData, wizData2: WizData, txTemplateData: TxData, version: VM, script: string, codeSeperator: string) => WizData;
export declare const checkSigAdd: (wizData: WizData, wizData2: WizData, wizData3: WizData, txTemplateData: TxData, version: VM, script: string, codeSeperator: string) => WizData;
export declare const checkMultiSig: (publicKeyList: WizData[], signatureList: WizData[], txTemplateData: TxData, version: VM, script: string, codeSeperator: string) => WizData;
export declare const tweakVerify: (wizData: WizData, wizData2: WizData, wizData3: WizData) => WizData;
export declare const shnorrSigVerify: (sig: WizData, msg: WizData, pubkey: WizData) => WizData;
declare type Keys = {
    privateKey: WizData;
    publicKey: WizData;
    uncompressedPubKey: WizData;
};
declare type Signs = {
    sign: WizData;
    derEncodedSign: WizData;
};
export declare const secp256k1KeyGenerator: () => Keys;
export declare const schnorrKeyGenerator: () => Keys;
export declare const secp256k1Sign: (message: WizData, privateKey: WizData) => Signs;
export declare const schnorrSign: (message: WizData, privateKey: WizData) => Signs;
export declare const secp256k1Verify: (message: WizData, signature: WizData, publicKey: WizData) => WizData;
export declare const secp256k1CreatePublicKey: (privateKey: WizData) => Keys;
export declare const schnorrCreatePublicKey: (privateKey: WizData) => Keys;
export {};
