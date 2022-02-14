import WizData, { hexLE } from "@script-wiz/wiz-data";
import { numToLE32, numToLE64 } from "./convertion";
import { hash256 } from "./crypto";
import { TxData, TxOutput } from "./model";
import { size } from "./splices";

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

export const segwitSerialization = (data: TxData) => {
  const currentInput = data.inputs[data.currentInputIndex];
  const scriptCode = WizData.fromHex(currentInput.scriptPubKey);
  const vout = numToLE32(WizData.fromNumber(Number(currentInput.vout))).hex;
  const inputAmount = numToLE64(WizData.fromNumber(Number(currentInput.amount) * 100000000)).hex;
  const timelock = numToLE32(WizData.fromNumber(Number(data.timelock))).hex;
  const version = numToLE32(WizData.fromNumber(Number(data.version))).hex;

  // 2 (32-byte hash)
  const hashPrevouts = hash256(WizData.fromHex(hexLE(currentInput.previousTxId) + vout)).toString();

  const nsequence = hexLE(currentInput.sequence);

  // 3 (32-byte hash)
  const hashSequence = hash256(WizData.fromHex(nsequence)).toString();

  // 4. outpoint (32-byte hash + 4-byte little endian)
  const outpoint = hexLE(currentInput.previousTxId) + vout;

  // 5. script code hash
  const scriptCodeSize = size(scriptCode).hex.substring(0, 2);

  // 8 hashOutputs
  const hashOutputs = calculateHashOutputs(data.outputs);

  return version + hashPrevouts + hashSequence + outpoint + scriptCodeSize + scriptCode.hex + inputAmount + nsequence + hashOutputs + timelock + "01000000";
};

const calculateHashOutputs = (outputs: TxOutput[]) => {
  let hashOutputs = "";

  outputs.forEach((output: TxOutput) => {
    hashOutputs += numToLE64(WizData.fromNumber(Number(output.amount) * 100000000)).hex + size(WizData.fromHex(output.scriptPubKey)).hex + output.scriptPubKey;
  });

  return hash256(WizData.fromHex(hashOutputs)).toString();
};
