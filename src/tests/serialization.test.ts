import WizData from "@script-wiz/wiz-data";
import { TxData } from "../model/TxData";
import { segwitSerialization, taprootSerialization } from "../serialization";

test("Serialization test", () => {
  const data: TxData = {
    inputs: [
      {
        previousTxId: "e700b7b330e4b56c5883d760f9cbe4fa47e0f62b350e108f1767bc07a4bbc07b",
        vout: "0",
        sequence: "fffffffe",
        scriptPubKey: "51205f4237bd7dae576b34abc8a9c6fa4f0e4787c04234ca963e9e96c8f9b67b56d1",
        amount: "0.0049175",
      },
      {
        previousTxId: "e700b7b330e4b56c5883d760f9cbe4fa47e0f62b350e108f1767bc07a4bbc07b",
        vout: "1",
        sequence: "fffffffe",
        scriptPubKey: "51205f4237bd7f93c69403a30c6b641f27ccf5201090152fcf1596474221307831c3",
        amount: "0.0049175",
      },
    ],
    outputs: [{ scriptPubKey: "0014173fd310e9db2c7e9550ce0f03f1e6c01d833aa9", amount: "0.009653" }],
    version: "2",
    timelock: "709631",
    currentInputIndex: 0,
  };

  console.log(taprootSerialization(data));
});
