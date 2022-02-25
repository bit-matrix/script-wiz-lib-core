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

test("LockTime checkSequenceVerify test", () => {
  const wizData: WizData = WizData.fromNumber(4194336);
  const txData: TxData = {
    inputs: [
      {
        previousTxId: "",
        vout: "",
        sequence: "00400020",
        scriptPubKey: "",
        amount: "",
        assetId: "",
      },
    ],
    outputs: [],
    version: "7",
    timelock: "",
    currentInputIndex: 0,
  };

  const result: WizData = checkSequenceVerify(wizData, txData);
  console.log(result);
  expect(result.number).toBe(1);
});
