import WizData from "@script-wiz/wiz-data";
import { bech32, bech32m } from "bech32";
import { sha256 } from "./crypto";

// version 0 -> segwit
// version 1 -> taproot

// prefix bc -> bitcoin mainnet
// prefix tb -> bitcoin testnet

export const createBech32Address = (data: WizData, prefix: string, version: number): string => {
  const hashedData = sha256(data).toString();

  const words = bech32.toWords(Buffer.from(hashedData, "hex"));

  words.unshift(version);

  const address = version === 0 ? bech32.encode(prefix, words) : bech32m.encode(prefix, words);

  return address;
};
