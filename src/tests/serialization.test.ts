import WizData from "@script-wiz/wiz-data";
import { TxData } from "../model/TxData";
import { segwitSerialization } from "../serialization";

test("Serialization test", () => {
  const scriptCode = WizData.fromHex(
    "532102318d667e9cc984efa0f6d097931f1de81d2f2dfa88c5ecdafc6fc7c68af9c7bf2102669cbf0cfc38977b9abe58670d000069f44003cea33feca3721c1d40864e9003210337af1d84366ce9ba1f36c2f764be62898c8a78d4a577921cbe8d78794d784c6b2103489b8cae1b962c23e1f58ce617a4a69626d7300ff8a1eb27d6578f99112b6d5354ae"
  );

  const data: TxData = {
    inputs: [
      {
        previousTxId: "22243961b22f1df3da07a01242b7e90ba0c9d68c230abd1ce22ac20a33546032",
        vout: "01000000",
        sequence: "ffffffff",
        scriptPubKey: "",
        amount: "b605e52a00000000",
      },
    ],
    outputs: [
      { scriptPubKey: "a9149fdbd5d7814e63f653663b06c2c3a122e2114aaf87", amount: "5e4ff20200000000" },
      { scriptPubKey: "002032e800529a4c3c2a9f9298ec1f9f488cb89f3d848b14e6279f15f00763aec765", amount: "f816f22700000000" },
    ],
    version: "01000000",
    timelock: "00000000",
    currentInputIndex: 0,
  };

  console.log(segwitSerialization(scriptCode, data));
});
