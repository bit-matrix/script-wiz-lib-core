// import { numberTestData } from "./data/number";
import WizData from "@script-wiz/wiz-data";
import { add64 } from "../arithmetics64";

test("add 64 function test", () => {
  const input1 = WizData.fromHex("f4ffffffffffffff");
  const input2 = WizData.fromHex("3100000000000000");

  const result = add64(input1, input2);

  console.log(result);
});
