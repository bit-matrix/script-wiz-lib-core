import WizData, { hexLE } from "@script-wiz/wiz-data";
import { numToLE32, numToLE64 } from "../convertion";
import { hash256, sha256 } from "../crypto";
import { TxInput, TxOutput } from "../model";
import { size } from "../splices";

export const calculateHashOutputs = (outputs: TxOutput[], isSegwit = true) => {
  let hashOutputs = "";

  outputs.forEach((output: TxOutput) => {
    if (output.amount === "" || output.scriptPubKey === "") throw "Amount and scriptPubkey must not be empty in output transaction template";

    hashOutputs += numToLE64(WizData.fromNumber(Number(output.amount) * 100000000)).hex + size(WizData.fromHex(output.scriptPubKey)).hex + output.scriptPubKey;
  });

  return isSegwit ? hash256(WizData.fromHex(hashOutputs)).toString() : sha256(WizData.fromHex(hashOutputs)).toString();
};

export const calculatePrevouts = (inputs: TxInput[], isSegwit = true) => {
  let hashInputs = "";

  inputs.forEach((input: TxInput) => {
    if (input.previousTxId === "" || input.vout === "") throw "Previous tx id and vout must not be empty";
    const vout = numToLE32(WizData.fromNumber(Number(input.vout))).hex;

    hashInputs += WizData.fromHex(hexLE(input.previousTxId) + vout).hex;
  });

  return isSegwit ? hash256(WizData.fromHex(hashInputs)).toString() : sha256(WizData.fromHex(hashInputs)).toString();
};

export const calculateInputAmounts = (inputs: TxInput[]) => {
  let inputAmounts = "";

  inputs.forEach((input: TxInput) => {
    if (input.amount === "") throw "Input amounts must not be empty";
    inputAmounts += numToLE64(WizData.fromNumber(Number(input.amount) * 100000000)).hex;
  });

  return sha256(WizData.fromHex(inputAmounts)).toString();
};

export const calculateInputScriptPubkeys = (inputs: TxInput[]) => {
  let inputScriptPubkeys = "";

  inputs.forEach((input: TxInput) => {
    if (input.scriptPubKey === "") throw "Input script pubkey must not be empty";

    inputScriptPubkeys += size(WizData.fromHex(input.scriptPubKey)).hex + input.scriptPubKey;
  });

  return sha256(WizData.fromHex(inputScriptPubkeys)).toString();
};

export const calculateInputSequences = (inputs: TxInput[]) => {
  let inputSequences = "";

  inputs.forEach((input: TxInput) => {
    if (input.sequence === "") throw "Input script sequence must not be empty";

    inputSequences += hexLE(input.sequence);
  });

  return sha256(WizData.fromHex(inputSequences)).toString();
};

export const emptyUnit = "00000000000000000000000000000000";
