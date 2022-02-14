import WizData from "@script-wiz/wiz-data";
import { TxData } from "../model/TxData";
import { segwitSerialization } from "../serialization";

test("Serialization test", () => {
  const data: TxData = {
    inputs: [
      {
        previousTxId: "f153bf852d442d9a37959a7609c1a2053a6c5f8167658a8ebf65de56708deb03",
        vout: "1",
        sequence: "fffffffd",
        scriptPubKey: "76a914d72cfa39705003d0131f4f5c04b3225800065fd388ac",
        amount: "0.06196677",
      },
    ],
    outputs: [
      { scriptPubKey: "a9142cdc473d4c01c6b4ecead83f440a18a58211ba2887", amount: "0.0006613" },
      { scriptPubKey: "0014e3062e121e0ffc0cb377ea11291c77d5a68d10cc", amount: "0.06114766" },
    ],
    version: "2",
    timelock: "721102",
    currentInputIndex: 0,
  };

  console.log(segwitSerialization(data));
});
