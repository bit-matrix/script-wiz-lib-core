import WizData from "@script-wiz/wiz-data";

export type Address = {
  testnet: string;
  mainnet: string;
};

export type Taproot = {
  tweak: WizData;
  scriptPubkey: WizData;
  address: Address;
};
