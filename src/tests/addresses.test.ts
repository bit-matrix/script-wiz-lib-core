import WizData from "@script-wiz/wiz-data";
import { createBech32Address } from "../addresses";

test("bech32test ", () => {
  const data = WizData.fromNumber(1);

  const res = createBech32Address("tex", data);

  console.log(res);
});
