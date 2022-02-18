import WizData from "@script-wiz/wiz-data";
import { bech32, bech32m } from "bech32";

export const createBech32Address = (data: WizData, prefix: string, version: number): string => {
  const words = bech32.toWords(Buffer.from(data.hex, "hex"));
  words.unshift(version);

  const address = version === 0 ? bech32.encode(prefix, words) : bech32m.encode(prefix, words);

  return address;
};
