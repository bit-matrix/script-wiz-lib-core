import WizData from "@script-wiz/wiz-data";
import { createBech32Address } from "../addresses";

test("bech32test ", () => {
  const data = WizData.fromHex("0100");

  const res = createBech32Address(data, "bc", 0);

  console.log(res);
});
