import WizData, { hexLE } from "@script-wiz/wiz-data";
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

  // 2 (32-byte hash)
  const hashPrevouts = hash256(WizData.fromHex(hexLE(currentInput.previousTxId) + currentInput.vout)).toString();

  // 3 (32-byte hash)
  const hashSequence = hash256(WizData.fromHex(hexLE(currentInput.sequence))).toString();

  // 4. outpoint (32-byte hash + 4-byte little endian)
  const outpoint = hexLE(currentInput.previousTxId) + currentInput.vout;

  // 5. script code hash
  const scriptCodeSize = size(scriptCode).hex.substring(0, 2);

  // 7 nsequence
  const nsequence = hexLE(currentInput.sequence);

  // 8 hashOutputs
  const hashOutputs = calculateHashOutputs(data.outputs);

  console.log(data.version);
  console.log(hashPrevouts);
  console.log(hashSequence);
  console.log(outpoint);
  console.log(scriptCodeSize);
  console.log(scriptCode.hex);
  console.log(currentInput.amount);
  console.log(hashOutputs);
  console.log(data.timelock);

  return data.version + hashPrevouts + hashSequence + outpoint + scriptCodeSize + scriptCode.hex + currentInput.amount + nsequence + hashOutputs + data.timelock + "01000000";
};

const calculateHashOutputs = (outputs: TxOutput[]) => {
  let hashOutputs = "";

  outputs.forEach((output: TxOutput) => {
    hashOutputs += output.amount + size(WizData.fromHex(output.scriptPubKey)).hex + output.scriptPubKey;
  });

  return hash256(WizData.fromHex(hashOutputs)).toString();
};
