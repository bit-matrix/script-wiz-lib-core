import WizData from "@script-wiz/wiz-data";
import { sha256straming } from "@bitmatrix/sha256streaming";

export const sha256Finalizer = (wizData: WizData, wizData2: WizData): WizData => {
  const result: string = sha256straming.sha256Finalizer(wizData.hex, wizData2.hex);

  return WizData.fromHex(result);
};

export const sha256Updater = (wizData: WizData, wizData2: WizData): WizData => {
  const result: string = sha256straming.sha256Updater(wizData.hex, wizData2.hex);

  return WizData.fromHex(result);
};

export const sha256Initializer = (wizData: WizData): WizData => {
  const result: string = sha256straming.sha256Initializer(wizData.hex);

  return WizData.fromHex(result);
};
