import WizData from "@script-wiz/wiz-data";
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
  if (currentTransactionInputSequence.number === -2147483647) return WizData.fromNumber(0);

  if (timelockNumber < inputNumber) return WizData.fromNumber(0);

  return WizData.fromNumber(1);
};

export const checkSequenceVerify = (wizData: WizData): WizData => {
  if (wizData.number !== undefined) {
    return WizData.fromNumber(1);
  }

  throw "Error: Invalid input: this operation requires a valid Script Number";
};
