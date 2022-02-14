// import { numberTestData } from "./data/number";
import WizData from "@script-wiz/wiz-data";
import { LE64ToNum, numToLE32 } from "../conversion";

test("LE64ToNum test", () => {
  const wizData: WizData = WizData.fromHex("0000000000000000");

  const result: WizData = LE64ToNum(wizData);
});

test("test", () => {
  const wizData: WizData = WizData.fromNumber(5);

  const result: WizData = numToLE32(wizData);

  console.log(result);
});
