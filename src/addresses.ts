import WizData from "@script-wiz/wiz-data";
import { bech32, bech32m } from "bech32";

export const createBech32Address = (prefix: string, data: WizData): string => {
  const words = bech32.toWords(Buffer.from(data.hex, "hex"));
  const address = bech32.encode(prefix, words);

  return address;
};

export const createBech32mAddress = (prefix: string, data: WizData): string => {
  const words = bech32m.toWords(Buffer.from(data.hex, "hex"));
  const address = bech32m.encode(prefix, words);

  return address;
};
