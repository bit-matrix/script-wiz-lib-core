import WizData from "@script-wiz/wiz-data";
import aa from "@bitmatrix/sha256streaming";

export const Sha256Finalizer = (wizData: WizData, wizData2: WizData): WizData => {
  const result: string = aa.mod.modsha256Finalizer(wizData.hex, wizData2.hex);

  return WizData.fromHex(result);
};

export const Sha256Updater = (wizData: WizData, wizData2: WizData): WizData => {
  const result: string = aa.mod.sha256Updater(wizData.hex, wizData2.hex);

  return WizData.fromHex(result);
};

export const Sha256Initializer = (wizData: WizData): WizData => {
  const result: string = aa.mod.sha256Initializer(wizData.hex);

  return WizData.fromHex(result);
};
