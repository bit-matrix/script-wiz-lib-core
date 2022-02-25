import WizData from "@script-wiz/wiz-data";
import { TxData } from "../model/TxData";
import { segwitSerialization } from "../serialization";

test("Serialization test", () => {
  const data: TxData = {
    inputs: [
      {
        previousTxId: "0930a48bd0b7ac94822b838b733ad0e9691bce1c6046fbd62e150788fce297f9",
        vout: "3",
        sequence: "ffffffff",
        scriptPubKey:
          "52210375e00eb72e29da82b89367947f29ef34afb75e8654f6ea368e0acdfd92976b7c2103a1b26313f430c4b15bb1fdce663207659d8cac749a0e53d70eff01874496feff2103c96d495bfdd5ba4145e3e046fee45e84a8a48ad05bd8dbb395c011a32cf9f88053ae",
        amount: "0.01662577",
      },
    ],
    outputs: [
      { scriptPubKey: "a914789b9183bc04977e34aaf9d22d41c6ff8867fc4087", amount: "0.013" },
      { scriptPubKey: "0020701a8d401c84fb13e6baf169d59684e17abd9fa216c8cc5b9fc63d622ff8c58d", amount: "0.00302577" },
    ],
    version: "1",
    timelock: "0",
    currentInputIndex: 0,
  };

  console.log(segwitSerialization(data));
});
