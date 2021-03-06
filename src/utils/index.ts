import WizData from "@script-wiz/wiz-data";
import BN from "bn.js";
import { convert64 } from "../convertion";
import varuint from "varuint-bitcoin";
import { ripemd160, sha256v2 } from "../crypto";

export const ZERO_64 = new BN(convert64(WizData.fromHex("00")).bin, 2);
export const MAX_INTEGER_64 = new BN("0111111111111111111111111111111111111111111111111111111111111111", 2);
export const MIN_INTEGER_64 = new BN("1000000010000000000000000000000000000000000000000000000000000000", 2);
export const NEGATIVE_1_64 = new BN("0000000000000000000000000000000000000000000000000000000010000001", 2);

export const flipbits = (str: string): string => {
  return str
    .split("")
    .map((b: any) => (1 - b).toString())
    .join("");
};

export const toHexString = (byteArray: Uint8Array) => {
  return Array.from(byteArray, function (byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
};

export const signdecimalToBinary = (decimalValue: number): string => {
  return (decimalValue >>> 0).toString(2);
};

export const calculateTwoPow = (value: number) => {
  const valueBin = signdecimalToBinary(value);
  const valueBinArray = valueBin.split("");

  const isCurrent2 = valueBinArray.filter((arr) => arr === "1");

  if (isCurrent2.length === 1) {
    return valueBinArray.length - 1;
  }

  return valueBinArray.length;
};

export const compactSizeVarInt = (hex: string) => {
  const hexByteSize = hex.length / 2;

  return varuint.encode(hexByteSize).toString("hex");
};

export const compactSizeVarIntData = (hex: string) => {
  const hexByteSize = hex.length / 2;

  return varuint.encode(hexByteSize).toString("hex") + hex;
};

export const publicKeyToScriptPubkey = (publickey: string) => {
  const pubKeyHash = sha256v2(WizData.fromHex(publickey));
  const scriptPubkey = ripemd160(WizData.fromHex(pubKeyHash)).toString();

  return scriptPubkey;
};
