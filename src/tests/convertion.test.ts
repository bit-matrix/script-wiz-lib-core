// import { numberTestData } from "./data/number";
import WizData from "@script-wiz/wiz-data";
import { LE32ToNum, LE64ToNum, numToLE32 } from "../convertion";

test("LE64ToNum test", () => {
  const wizData: WizData = WizData.fromHex("14000000");

  const result: WizData = LE32ToNum(wizData);
  console.log(result);
});
