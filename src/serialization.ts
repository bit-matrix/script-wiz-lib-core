import WizData, { hexLE } from "@script-wiz/wiz-data";
import { convert32, numToLE32, numToLE64 } from "./convertion";
import { hash256, SIGHASH_TYPE } from "./crypto";
import { TxData } from "./model";
import { size } from "./splices";
import { tapLeaf } from "./taproot";
import { VM_NETWORK } from "./taproot/model";
import { calculateHashOutputs, calculateInputAmounts, calculateInputScriptPubkeys, calculateInputSequences, calculatePrevouts, emptyUnit } from "./utils/serializationutils";

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
export const segwitSerialization = (data: TxData, sighashType: SIGHASH_TYPE, codeSeperator: string) => {
  switch (sighashType) {
    case SIGHASH_TYPE.SIGHASH_ALL:
      return sighashAll(data, codeSeperator);
    case SIGHASH_TYPE.SIGHASH_SINGLE:
      return sighashSingle(data, codeSeperator);
    case SIGHASH_TYPE.SIGHASH_NONE:
      return sighashNone(data, codeSeperator);
    case SIGHASH_TYPE.SIGHASH_ANYONECANPAY:
      return sighashAnyonecanpay(data, codeSeperator);

    default:
      return sighashAll(data, codeSeperator);
  }
};

export const taprootSerialization = (data: TxData, script: string, network: VM_NETWORK, sighashType: SIGHASH_TYPE, codeSeperator: string) => {
  switch (sighashType) {
    case SIGHASH_TYPE.SIGHASH_ALL:
      return sighashAllT(data, script, network, codeSeperator);

    case SIGHASH_TYPE.SIGHASH_SINGLE:
      return sighashSingleT(data, script, network, codeSeperator);

    case SIGHASH_TYPE.SIGHASH_ANYONECANPAY:
      return sighashAnyonecanpayT(data, script, network, codeSeperator);

    case SIGHASH_TYPE.SIGHASH_NONE:
      return sighashNoneT(data, script, network, codeSeperator);

    default:
      return sighashAllT(data, script, network, codeSeperator);
  }
};

const sighashAll = (data: TxData, codeSeperator: string) => {
  const currentInput = data.inputs[data.currentInputIndex];

  if (currentInput.scriptPubKey === "") throw "scriptPubkey must not be empty in transaction template";

  const scriptCode = WizData.fromHex(currentInput.scriptPubKey);

  if (currentInput.vout === "") throw "Vout must not be empty in transaction template";
  const vout = numToLE32(WizData.fromNumber(Number(currentInput.vout))).hex;

  if (currentInput.amount === "") throw "Amount must not be empty in transaction template";
  const inputAmount = numToLE64(WizData.fromNumber(Number(currentInput.amount) * 100000000)).hex;

  if (data.timelock === "") throw "Timelock must not be empty in transaction template";
  const timelock = numToLE32(WizData.fromNumber(Number(data.timelock))).hex;

  if (data.version === "") throw "Version must not be empty in transaction template";
  const version = numToLE32(WizData.fromNumber(Number(data.version))).hex;

  // 2 (32-byte hash)

  if (currentInput.previousTxId === "") throw "Previous TX ID must not be empty in transaction template";
  const hashPrevouts = calculatePrevouts(data.inputs);

  if (currentInput.sequence === "") throw "Sequence must not be empty in transaction template";
  const nsequence = hexLE(currentInput.sequence);

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

  return version + hashPrevouts + hashSequence + outpoint + scriptCodeSize + scriptCode.hex + inputAmount + nsequence + hashOutputs + timelock + "01" + codeSeperator !== ""
    ? convert32(WizData.fromHex(codeSeperator)).hex
    : "ffffffff";
};

const sighashSingle = (data: TxData, codeSeperator: string) => {
  const currentInput = data.inputs[data.currentInputIndex];

  if (currentInput.scriptPubKey === "") throw "scriptPubkey must not be empty in transaction template";

  const scriptCode = WizData.fromHex(currentInput.scriptPubKey);

  if (currentInput.vout === "") throw "Vout must not be empty in transaction template";
  const vout = numToLE32(WizData.fromNumber(Number(currentInput.vout))).hex;

  if (currentInput.amount === "") throw "Amount must not be empty in transaction template";
  const inputAmount = numToLE64(WizData.fromNumber(Number(currentInput.amount) * 100000000)).hex;

  if (data.timelock === "") throw "Timelock must not be empty in transaction template";
  const timelock = numToLE32(WizData.fromNumber(Number(data.timelock))).hex;

  if (data.version === "") throw "Version must not be empty in transaction template";
  const version = numToLE32(WizData.fromNumber(Number(data.version))).hex;

  // 2 (32-byte hash)

  if (currentInput.previousTxId === "") throw "Previous TX ID must not be empty in transaction template";
  const hashPrevouts = calculatePrevouts(data.inputs);

  if (currentInput.sequence === "") throw "Sequence must not be empty in transaction template";
  const nsequence = hexLE(currentInput.sequence);

  // 3 (32-byte hash)
  const hashSequence = emptyUnit;

  // 4. outpoint (32-byte hash + 4-byte little endian)
  const outpoint = hexLE(currentInput.previousTxId) + vout;
  if (outpoint === "") throw "Previous TX ID and Vout must not be empty in transaction template";

  // 5. script code hash
  const scriptCodeSize = size(scriptCode).hex.substring(0, 2);
  if (scriptCodeSize === "") throw "scriptPubkey must not be empty in transaction template";

  let hashOutputs = emptyUnit;

  if (data.currentInputIndex < data.outputs.length) hashOutputs = calculateHashOutputs([data.outputs[data.currentInputIndex]]);

  return version + hashPrevouts + hashSequence + outpoint + scriptCodeSize + scriptCode.hex + inputAmount + nsequence + hashOutputs + timelock + "01" + codeSeperator !== ""
    ? convert32(WizData.fromHex(codeSeperator)).hex
    : "ffffffff";
};

const sighashNone = (data: TxData, codeSeperator: string) => {
  const currentInput = data.inputs[data.currentInputIndex];

  if (currentInput.scriptPubKey === "") throw "scriptPubkey must not be empty in transaction template";

  const scriptCode = WizData.fromHex(currentInput.scriptPubKey);

  if (currentInput.vout === "") throw "Vout must not be empty in transaction template";
  const vout = numToLE32(WizData.fromNumber(Number(currentInput.vout))).hex;

  if (currentInput.amount === "") throw "Amount must not be empty in transaction template";
  const inputAmount = numToLE64(WizData.fromNumber(Number(currentInput.amount) * 100000000)).hex;

  if (data.timelock === "") throw "Timelock must not be empty in transaction template";
  const timelock = numToLE32(WizData.fromNumber(Number(data.timelock))).hex;

  if (data.version === "") throw "Version must not be empty in transaction template";
  const version = numToLE32(WizData.fromNumber(Number(data.version))).hex;

  // 2 (32-byte hash)

  if (currentInput.previousTxId === "") throw "Previous TX ID must not be empty in transaction template";
  const hashPrevouts = calculatePrevouts(data.inputs);

  if (currentInput.sequence === "") throw "Sequence must not be empty in transaction template";
  const nsequence = hexLE(currentInput.sequence);

  // 3 (32-byte hash)
  const hashSequence = emptyUnit;

  // 4. outpoint (32-byte hash + 4-byte little endian)
  const outpoint = hexLE(currentInput.previousTxId) + vout;
  if (outpoint === "") throw "Previous TX ID and Vout must not be empty in transaction template";

  // 5. script code hash
  const scriptCodeSize = size(scriptCode).hex.substring(0, 2);
  if (scriptCodeSize === "") throw "scriptPubkey must not be empty in transaction template";

  return version + hashPrevouts + hashSequence + outpoint + scriptCodeSize + scriptCode.hex + inputAmount + nsequence + timelock + "01" + codeSeperator !== ""
    ? convert32(WizData.fromHex(codeSeperator)).hex
    : "ffffffff";
};

const sighashAnyonecanpay = (data: TxData, codeSeperator: string) => {
  const currentInput = data.inputs[data.currentInputIndex];

  if (currentInput.scriptPubKey === "") throw "scriptPubkey must not be empty in transaction template";

  const scriptCode = WizData.fromHex(currentInput.scriptPubKey);

  if (currentInput.vout === "") throw "Vout must not be empty in transaction template";
  const vout = numToLE32(WizData.fromNumber(Number(currentInput.vout))).hex;

  if (currentInput.amount === "") throw "Amount must not be empty in transaction template";
  const inputAmount = numToLE64(WizData.fromNumber(Number(currentInput.amount) * 100000000)).hex;

  if (data.timelock === "") throw "Timelock must not be empty in transaction template";
  const timelock = numToLE32(WizData.fromNumber(Number(data.timelock))).hex;

  if (data.version === "") throw "Version must not be empty in transaction template";
  const version = numToLE32(WizData.fromNumber(Number(data.version))).hex;

  const hashPrevouts = emptyUnit;

  if (currentInput.sequence === "") throw "Sequence must not be empty in transaction template";
  const nsequence = hexLE(currentInput.sequence);

  // 3 (32-byte hash)
  const hashSequence = emptyUnit;

  // 4. outpoint (32-byte hash + 4-byte little endian)
  const outpoint = hexLE(currentInput.previousTxId) + vout;
  if (outpoint === "") throw "Previous TX ID and Vout must not be empty in transaction template";

  // 5. script code hash
  const scriptCodeSize = size(scriptCode).hex.substring(0, 2);
  if (scriptCodeSize === "") throw "scriptPubkey must not be empty in transaction template";

  // 8 hashOutputs
  const hashOutputs = calculateHashOutputs(data.outputs);

  return version + hashPrevouts + hashSequence + outpoint + scriptCodeSize + scriptCode.hex + inputAmount + nsequence + hashOutputs + timelock + "01" + codeSeperator !== ""
    ? convert32(WizData.fromHex(codeSeperator)).hex
    : "ffffffff";
};

const sighashAllT = (data: TxData, script: string, network: VM_NETWORK, codeSeperator: string) => {
  const concat = "00";

  if (data.version === "") throw "Version must not be empty in transaction template";
  const version = numToLE32(WizData.fromNumber(Number(data.version))).hex;

  if (data.timelock === "") throw "Timelock must not be empty in transaction template";
  const timelock = numToLE32(WizData.fromNumber(Number(data.timelock))).hex;

  const hashPrevouts = calculatePrevouts(data.inputs, false);

  const inputAmountsSha = calculateInputAmounts(data.inputs);

  const inputPubkeySha = calculateInputScriptPubkeys(data.inputs);

  const inputSequencesSha = calculateInputSequences(data.inputs);

  const spendType = "02";

  const currentIndex = numToLE32(WizData.fromNumber(data.currentInputIndex)).hex;

  const tapleaf = tapLeaf(WizData.fromHex(script), network === VM_NETWORK.BTC ? "c0" : "c4");

  const outputs = calculateHashOutputs(data.outputs, false);

  return concat +
    SIGHASH_TYPE.SIGHASH_ALL +
    version +
    timelock +
    hashPrevouts +
    inputAmountsSha +
    inputPubkeySha +
    inputSequencesSha +
    outputs +
    spendType +
    currentIndex +
    tapleaf +
    "00" +
    codeSeperator !==
    ""
    ? convert32(WizData.fromHex(codeSeperator)).hex
    : "ffffffff";
};

const sighashSingleT = (data: TxData, script: string, network: VM_NETWORK, codeSeperator: string) => {
  const concat = "00";

  if (data.version === "") throw "Version must not be empty in transaction template";
  const version = numToLE32(WizData.fromNumber(Number(data.version))).hex;

  if (data.timelock === "") throw "Timelock must not be empty in transaction template";
  const timelock = numToLE32(WizData.fromNumber(Number(data.timelock))).hex;

  const hashPrevouts = calculatePrevouts(data.inputs, false);

  const inputAmountsSha = calculateInputAmounts(data.inputs);

  const inputPubkeySha = calculateInputScriptPubkeys(data.inputs);

  const inputSequencesSha = calculateInputSequences(data.inputs);

  const spendType = "02";

  const currentIndex = numToLE32(WizData.fromNumber(data.currentInputIndex)).hex;

  const tapleaf = tapLeaf(WizData.fromHex(script), network === VM_NETWORK.BTC ? "c0" : "c4");

  const outputs = calculateHashOutputs([data.outputs[data.currentInputIndex]], false);

  return concat +
    SIGHASH_TYPE.SIGHASH_SINGLE +
    version +
    timelock +
    hashPrevouts +
    inputAmountsSha +
    inputPubkeySha +
    inputSequencesSha +
    outputs +
    spendType +
    currentIndex +
    tapleaf +
    "00" +
    codeSeperator !==
    ""
    ? convert32(WizData.fromHex(codeSeperator)).hex
    : "ffffffff";
};

const sighashAnyonecanpayT = (data: TxData, script: string, network: VM_NETWORK, codeSeperator: string) => {
  const concat = "00";

  if (data.version === "") throw "Version must not be empty in transaction template";
  const version = numToLE32(WizData.fromNumber(Number(data.version))).hex;

  if (data.timelock === "") throw "Timelock must not be empty in transaction template";
  const timelock = numToLE32(WizData.fromNumber(Number(data.timelock))).hex;

  const currentInput = data.inputs[data.currentInputIndex];

  const outpoint = currentInput.previousTxId + currentInput.vout;

  const amount = numToLE64(WizData.fromNumber(Number(currentInput.amount) * 100000000)).hex;

  const nSequence = hexLE(currentInput.sequence);

  const spendType = "02";

  const currentIndex = numToLE32(WizData.fromNumber(data.currentInputIndex)).hex;

  const tapleaf = tapLeaf(WizData.fromHex(script), network === VM_NETWORK.BTC ? "c0" : "c4");

  const outputs = calculateHashOutputs([data.outputs[data.currentInputIndex]], false);

  return concat +
    SIGHASH_TYPE.SIGHASH_ANYONECANPAY +
    version +
    timelock +
    spendType +
    outpoint +
    amount +
    currentInput.scriptPubKey +
    nSequence +
    outputs +
    currentIndex +
    tapleaf +
    "00" +
    codeSeperator !==
    ""
    ? convert32(WizData.fromHex(codeSeperator)).hex
    : "ffffffff";
};

const sighashNoneT = (data: TxData, script: string, network: VM_NETWORK, codeSeperator: string) => {
  const concat = "00";

  if (data.version === "") throw "Version must not be empty in transaction template";
  const version = numToLE32(WizData.fromNumber(Number(data.version))).hex;

  if (data.timelock === "") throw "Timelock must not be empty in transaction template";
  const timelock = numToLE32(WizData.fromNumber(Number(data.timelock))).hex;

  const hashPrevouts = calculatePrevouts(data.inputs, false);

  const inputAmountsSha = calculateInputAmounts(data.inputs);

  const inputPubkeySha = calculateInputScriptPubkeys(data.inputs);

  const inputSequencesSha = calculateInputSequences(data.inputs);

  const spendType = "02";

  const currentIndex = numToLE32(WizData.fromNumber(data.currentInputIndex)).hex;

  const tapleaf = tapLeaf(WizData.fromHex(script), network === VM_NETWORK.BTC ? "c0" : "c4");

  return concat +
    SIGHASH_TYPE.SIGHASH_SINGLE +
    version +
    timelock +
    hashPrevouts +
    inputAmountsSha +
    inputPubkeySha +
    inputSequencesSha +
    spendType +
    currentIndex +
    tapleaf +
    "00" +
    codeSeperator !==
    ""
    ? convert32(WizData.fromHex(codeSeperator)).hex
    : "ffffffff";
};
