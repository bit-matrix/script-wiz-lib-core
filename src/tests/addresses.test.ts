import WizData from "@script-wiz/wiz-data";
import { createBech32Address } from "../addresses";

test("bech32test ", () => {
  const data = WizData.fromHex("1863143c14c5166804bd19203356da136c985678cd4d27a1b8c6329604903262");

  const res = createBech32Address(data, "bc", 0);

  console.log(res);
});
