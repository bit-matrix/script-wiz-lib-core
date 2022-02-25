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
  if (currentInput.scriptPubKey === "") throw "scriptPubkey must not be empty in transaction template";

  const vout = numToLE32(WizData.fromNumber(Number(currentInput.vout))).hex;
  if (currentInput.vout === "") throw "Vout must not be empty in transaction template";

  const inputAmount = numToLE64(WizData.fromNumber(Number(currentInput.amount) * 100000000)).hex;
  if (currentInput.amount === "") throw "Amount must not be empty in transaction template";

  const timelock = numToLE32(WizData.fromNumber(Number(data.timelock))).hex;
  if (data.timelock === "") throw "Timelock must not be empty in transaction template";

  const version = numToLE32(WizData.fromNumber(Number(data.version))).hex;
  if (data.version === "") throw "Version must not be empty in transaction template";

  // 2 (32-byte hash)
  const hashPrevouts = hash256(WizData.fromHex(hexLE(currentInput.previousTxId) + vout)).toString();
  if (currentInput.previousTxId === "") throw "Previous TX ID must not be empty in transaction template";

  const nsequence = hexLE(currentInput.sequence);
  if (currentInput.sequence === "") throw "Sequence must not be empty in transaction template";

  // 3 (32-byte hash)
  const hashSequence = hash256(WizData.fromHex(nsequence)).toString();
  if (hashSequence === "") throw "Sequence must not be empty in transaction template";

  // 4. outpoint (32-byte hash + 4-byte little endian)
  const outpoint = hexLE(currentInput.previousTxId) + vout;
  if (outpoint === "") throw "Previous TX ID and Vout must not be empty in transaction template";

  // 5. script code hash
  const scriptCodeSize = size(scriptCode).hex.substring(0, 2);
  if (scriptCodeSize === "") throw "scriptPubkey must not be empty in transaction template";

  // 8 hashOutputs
  const hashOutputs = calculateHashOutputs(data.outputs);

  return version + hashPrevouts + hashSequence + outpoint + scriptCodeSize + scriptCode.hex + inputAmount + nsequence + hashOutputs + timelock + "01000000";
};

const calculateHashOutputs = (outputs: TxOutput[]) => {
  let hashOutputs = "";

  outputs.forEach((output: TxOutput) => {
    if (output.amount === "" || output.scriptPubKey === "") throw "Amount and scriptPubkey must not be empty in output transaction template";

    hashOutputs += numToLE64(WizData.fromNumber(Number(output.amount) * 100000000)).hex + size(WizData.fromHex(output.scriptPubKey)).hex + output.scriptPubKey;
  });

  return hash256(WizData.fromHex(hashOutputs)).toString();
};
