import WizData from "@script-wiz/wiz-data";
import { TxInput } from "../model";
import { inspectInputValue } from "../introspection";

test("inspectInputValue", () => {
  const input = WizData.fromNumber(0);

  const txInput: TxInput[] = [
    {
      previousTxId: "",
      vout: "",
      sequence: "",
      scriptPubKey: "",
      amount: "0.00000786",
    },
  ];

  const result = inspectInputValue(input, txInput);

  console.log(result);
});
