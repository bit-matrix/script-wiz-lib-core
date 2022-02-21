// import { numberTestData } from "./data/number";
import WizData from "@script-wiz/wiz-data";
import { TxData } from "..";
import { checkLockTimeVerify, checkSequenceVerify } from "../locktime";

// test("LockTime checkLockTimeVerify test", () => {
//   const txData: TxData = {
//     inputs: [],
//     outputs: [],
//     version: "",
//     timelock: "7",
//     currentInputIndex: 0,
//   };

//   checkLockTimeVerify(txData, true);
// });

// test("LockTime checkSequenceVerify test", () => {
//   const wizData: WizData = WizData.fromNumber(5);

//   const result: WizData = checkLockTimeVerify(wizData);
//   expect(result.number).toBe(1);
// });
