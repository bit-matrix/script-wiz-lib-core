import WizData from "@script-wiz/wiz-data";
import { sha256 } from "../crypto";
import { calculateTwoPow, toHexString } from "../utils";
import { Taproot } from "./model";
import * as segwit_addr from "../bech32/segwit_addr";
import bcrypto from "bcrypto";
import { TAPROOT_VERSION } from "../model";
import varuint from "varuint-bitcoin";
import BN from "bn.js";

// type TreeHelper = {
//   data: string;
//   h: string;
// };

export const tweakAdd = (pubkey: WizData, tweak: WizData): WizData => {
  if (pubkey.bytes.length !== 32) {
    throw "Pubkey length must be equal 32 byte";
  }

  const tweaked = WizData.fromHex(bcrypto.schnorr.publicKeyTweakAdd(Buffer.from(pubkey.hex, "hex"), Buffer.from(tweak.hex, "hex")).toString("hex"));

  return publicKeyTweakCheck(pubkey, tweak, tweaked);
};

export const publicKeyTweakCheck = (pubkey: WizData, tweak: WizData, expect: WizData): WizData => {
  if (pubkey.bytes.length !== 32) {
    throw "Pubkey length must be equal 32 byte";
  }

  const isNegate = bcrypto.schnorr.publicKeyTweakCheck(Buffer.from(pubkey.hex, "hex"), Buffer.from(tweak.hex, "hex"), Buffer.from(expect.hex, "hex"), true);

  if (isNegate) {
    return WizData.fromHex("03" + expect.hex);
  }

  return WizData.fromHex("02" + expect.hex);
};

export const publicKeyTweakCheckWithPrefix = (pubkey: WizData, tweak: WizData, expect: WizData): boolean => {
  if (pubkey.bytes.length !== 32) {
    throw "Pubkey length must be equal 32 byte";
  }

  const expectKeyWithoutPrefix = expect.bytes.slice(1, expect.bytes.length);
  const expectKeyWithoutPrefixData = WizData.fromBytes(expectKeyWithoutPrefix);

  return bcrypto.schnorr.publicKeyTweakCheck(
    Buffer.from(pubkey.hex, "hex"),
    Buffer.from(tweak.hex, "hex"),
    Buffer.from(expectKeyWithoutPrefixData.hex, "hex"),
    expect.bytes[0] === 3
  );
};

export const tagHash = (tag: string, data: WizData) => {
  let hashedTag = sha256(WizData.fromText(tag)).toString();

  hashedTag = hashedTag.concat(hashedTag);

  hashedTag = hashedTag.concat(toHexString(data.bytes));

  return sha256(WizData.fromHex(hashedTag)).toString();
};

export const tapLeaf = (script: WizData, version: string) => {
  const leaftag = version === "c4" ? "TapLeaf/elements" : "TapLeaf";
  const scriptLength = varuint.encode(script.bytes.length).toString("hex");

  const scriptData = version + scriptLength + script.hex;
  const h = tagHash(leaftag, WizData.fromHex(scriptData));

  return h;
};

const calculateTapBranch = (tapLeaf1: string, tapLeaf2: string, version: string, nextLookup?: string): { tapBranchResult: WizData; sibling: string | undefined } => {
  const tapBranchtag = version === "c4" ? "TapBranch/elements" : "TapBranch";
  const tapLeaf1Bn = new BN(tapLeaf1, "hex");
  const tapLeaf2Bn = new BN(tapLeaf2, "hex");
  let sibling: string | undefined;

  if (tapLeaf1 === nextLookup) {
    sibling = tapLeaf2;
  }

  if (tapLeaf2 === nextLookup) {
    sibling = tapLeaf1;
  }

  if (tapLeaf1Bn.gt(tapLeaf2Bn)) {
    return { tapBranchResult: WizData.fromHex(tagHash(tapBranchtag, WizData.fromHex(tapLeaf2.concat(tapLeaf1)))), sibling };
  } else {
    return { tapBranchResult: WizData.fromHex(tagHash(tapBranchtag, WizData.fromHex(tapLeaf1.concat(tapLeaf2)))), sibling };
  }
};

export const controlBlockCalculation = (scripts: WizData[], version: string, innerkey: string, lookupLeafIndex: number): string => {
  const scriptLength = scripts.length;
  const leafGroupCount = calculateTwoPow(scriptLength);

  const controlBlockArray = [];
  let tapBranchResults: { step: number; data: WizData }[] = [];

  if (scriptLength === 1) {
    throw "Doesnt support in single leaf";
  } else {
    let nextLookup = tapLeaf(scripts[lookupLeafIndex], version);

    for (let i = 1; i <= leafGroupCount; i++) {
      if (tapBranchResults.length > 0) {
        const filteredTapBranchResults = tapBranchResults.filter((tp) => tp.step === i - 1);

        // 2+ step
        for (let z = 0; z < filteredTapBranchResults.length; z += 2) {
          if (z + 1 < filteredTapBranchResults.length) {
            const calculatedTapBranchResult = calculateTapBranch(filteredTapBranchResults[z].data.hex, filteredTapBranchResults[z + 1].data.hex, version, nextLookup);

            if (calculatedTapBranchResult.sibling) {
              controlBlockArray.push(calculatedTapBranchResult.sibling);
              nextLookup = calculatedTapBranchResult.tapBranchResult.hex;
            }

            tapBranchResults.push({
              step: i,
              data: calculatedTapBranchResult.tapBranchResult,
            });
          } else {
            tapBranchResults.push({ step: i, data: tapBranchResults[z].data });
          }
        }
      } else {
        // 1. step
        for (let y = 0; y < scriptLength; y += 2) {
          if (y + 1 < scriptLength) {
            const tapLeaf1 = tapLeaf(scripts[y], version);
            const tapLeaf2 = tapLeaf(scripts[y + 1], version);
            const calculatedTapBranchResult = calculateTapBranch(tapLeaf1, tapLeaf2, version, nextLookup);

            if (calculatedTapBranchResult.sibling) {
              controlBlockArray.push(calculatedTapBranchResult.sibling);
              nextLookup = calculatedTapBranchResult.tapBranchResult.hex;
            }

            tapBranchResults.push({ step: 1, data: calculatedTapBranchResult.tapBranchResult });
          } else {
            tapBranchResults.push({ step: 1, data: WizData.fromHex(tapLeaf(scripts[y], version)) });
          }
        }
      }
    }
  }

  return innerkey + controlBlockArray.join("");
};

export const treeHelper = (scripts: WizData[], version: string): string => {
  const scriptLength = scripts.length;
  const leafGroupCount = calculateTwoPow(scriptLength);

  let tapBranchResults: { step: number; data: WizData }[] = [];

  if (scriptLength === 1) {
    return tapLeaf(scripts[0], version);
  } else {
    for (let i = 1; i <= leafGroupCount; i++) {
      if (tapBranchResults.length > 0) {
        const filteredTapBranchResults = tapBranchResults.filter((tp) => tp.step === i - 1);

        // 2+ step
        for (let z = 0; z < filteredTapBranchResults.length; z += 2) {
          if (z + 1 < filteredTapBranchResults.length) {
            const calculatedTapBranchResult = calculateTapBranch(filteredTapBranchResults[z].data.hex, filteredTapBranchResults[z + 1].data.hex, version);
            tapBranchResults.push({
              step: i,
              data: calculatedTapBranchResult.tapBranchResult,
            });
          } else {
            tapBranchResults.push({ step: i, data: tapBranchResults[z].data });
          }
        }
      } else {
        // 1. step
        for (let y = 0; y < scriptLength; y += 2) {
          if (y + 1 < scriptLength) {
            const tapLeaf1 = tapLeaf(scripts[y], version);
            const tapLeaf2 = tapLeaf(scripts[y + 1], version);
            const calculatedTapBranchResult = calculateTapBranch(tapLeaf1, tapLeaf2, version);

            tapBranchResults.push({ step: 1, data: calculatedTapBranchResult.tapBranchResult });
          } else {
            tapBranchResults.push({ step: 1, data: WizData.fromHex(tapLeaf(scripts[y], version)) });
          }
        }
      }
    }
  }

  const finalResult = tapBranchResults.find((tb) => tb.step === leafGroupCount);

  if (finalResult) {
    return finalResult.data.hex;
  }

  return "";
};

// export const getVersionTaggedPubKey = (pubkey: WizData): WizData => {
//   const logic = pubkey.bytes[0] & 1;

//   console.log("logic", logic);
//   if (logic === 1) {
//     return WizData.fromHex("00");
//   }

//   return WizData.fromNumber(1);
// };

export const tapRoot = (pubKey: WizData, scripts: WizData[], taprootVersion: TAPROOT_VERSION): Taproot => {
  const version = taprootVersion === TAPROOT_VERSION.LIQUID ? "c4" : "c0";
  const tag = taprootVersion === TAPROOT_VERSION.LIQUID ? "TapTweak/elements" : "TapTweak";

  const h: string = treeHelper(scripts, version);

  console.log("tap leaf result", h);

  const tweak = tagHash(tag, WizData.fromHex(pubKey.hex + h));

  console.log("tap tweak result", tweak);

  const tweaked = tweakAdd(pubKey, WizData.fromHex(tweak));

  console.log("tap tweaked result:", tweaked.hex);

  const finalTweaked = tweaked.hex.substr(2);

  console.log("final tweaked", finalTweaked);

  const op1Hex = "51";

  let testnetAddress = "";
  let mainnetAddress = "";

  if (taprootVersion === TAPROOT_VERSION.BITCOIN) {
    testnetAddress = segwit_addr.encode("tb", 1, WizData.fromHex(finalTweaked).bytes) || "";
    mainnetAddress = segwit_addr.encode("bc", 1, WizData.fromHex(finalTweaked).bytes) || "";
  } else {
    testnetAddress = segwit_addr.encode("tex", 1, WizData.fromHex(finalTweaked).bytes) || "";
    mainnetAddress = segwit_addr.encode("ex", 1, WizData.fromHex(finalTweaked).bytes) || "";
  }

  const scriptPubkey = WizData.fromHex(op1Hex + WizData.fromNumber(finalTweaked.length / 2).hex + finalTweaked);

  console.log("script pub key", scriptPubkey.hex);

  return { scriptPubkey, tweak: tweaked, address: { testnet: testnetAddress, mainnet: mainnetAddress } };
};
