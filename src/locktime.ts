import WizData from "@script-wiz/wiz-data";

export const checkLockTimeVerify = (wizData: WizData) => {
  if (wizData.number === undefined) {
    throw "Error: Invalid input: this operation requires a valid Script Number";
  }

  // TODO check against transaction
};

export const checkSequenceVerify = (wizData: WizData) => {
  if (wizData.number === undefined) {
    throw "Error: Invalid input: this operation requires a valid Script Number";
  }

  // TODO check against transaction
};
