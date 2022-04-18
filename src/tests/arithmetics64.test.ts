// import { numberTestData } from "./data/number";
import WizData from "@script-wiz/wiz-data";
import { add64, sub64 } from "../arithmetics64";

test("add 64 function test", () => {
  const input1 = WizData.fromHex("0094357700000000");
  const input2 = WizData.fromHex("ce93357700000000");

  const result = sub64(input1, input2);

  // console.log(result);
});
