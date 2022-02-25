import WizData, { hexLE } from "@script-wiz/wiz-data";
import { TxData } from ".";

export const checkLockTimeVerify = (input: WizData, txData: TxData): WizData => {
  const timelockNumber = Number(txData.timelock);
  const inputNumber = input.number;
  const LOCKTIME_THRESHOLD: number = 500000000;

  if (inputNumber === undefined) throw "Error: Invalid input: this operation requires a valid Script Number";
  if (txData.timelock === undefined) throw "Timelock is undefined";
  if (isNaN(timelockNumber)) throw "Timelock is not a valid number";

  if (inputNumber < 0) return WizData.fromNumber(0);

  if (LOCKTIME_THRESHOLD > inputNumber && LOCKTIME_THRESHOLD < timelockNumber) return WizData.fromNumber(0);
  if (LOCKTIME_THRESHOLD < inputNumber && LOCKTIME_THRESHOLD > timelockNumber) return WizData.fromNumber(0);

  const currentTransactionInputSequence = WizData.fromHex(txData.inputs[txData.currentInputIndex].sequence);
  if (txData.inputs[txData.currentInputIndex].sequence === "") throw "Sequence must not be empty in transaction template";

  if (currentTransactionInputSequence.number === -2147483647) return WizData.fromNumber(0);
  if (timelockNumber < inputNumber) return WizData.fromNumber(0);

  return WizData.fromNumber(1);
};

export const checkSequenceVerify = (input: WizData, txData: TxData): WizData => {
  if (input.number === undefined) throw "Input number is invalid";
  if (txData.version === "") throw "Transaction template version is empty";

  const transactionSequenceNumber = WizData.fromHex(txData.inputs[txData.currentInputIndex].sequence);
  if (txData.inputs[txData.currentInputIndex].sequence === "") throw "Sequence must not be empty in transaction template";

  if (transactionSequenceNumber.number === undefined) throw "Transaction template sequence is invalid";

  const inputUnitValue = parseInt(input.bin.slice(16, 33), 2);
  const inputDisableFlag = input.bin[0];
  const inputTypeFlag = input.bin[9];
  const transactionBlockUnitValue = parseInt(transactionSequenceNumber.bin.slice(16, 33), 2);
  const transactionTypeFlag = transactionSequenceNumber.bin[9];

  if (inputUnitValue > transactionBlockUnitValue) return WizData.fromNumber(0);
  if (Number(txData.version) < 2) return WizData.fromNumber(0);
  if (input.number < 0) return WizData.fromNumber(0);
  if (Number(inputDisableFlag) !== 0) return WizData.fromNumber(0);
  if (Number(inputTypeFlag) === 0 && Number(transactionTypeFlag) === 1) return WizData.fromNumber(0);
  if (Number(inputTypeFlag) === 1 && Number(transactionTypeFlag) === 0) return WizData.fromNumber(0);

  return WizData.fromNumber(1);
};
