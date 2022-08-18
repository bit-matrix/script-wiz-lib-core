import WizData from "@script-wiz/wiz-data";
import Sha256Stream from "@bitmatrix/sha256streaming";

export const sha256Finalizer = (wizData: WizData, wizData2: WizData): WizData => {
  const result: string = Sha256Stream.sha256Finalizer(wizData.hex, wizData2.hex);

  return WizData.fromHex(result);
};

export const sha256Updater = (wizData: WizData, wizData2: WizData): WizData => {
  const result: string = Sha256Stream.sha256Updater(wizData.hex, wizData2.hex);

  return WizData.fromHex(result);
};

export const sha256Initializer = (wizData: WizData): WizData => {
  const result: string = Sha256Stream.sha256Initializer(wizData.hex);

  return WizData.fromHex(result);
};
