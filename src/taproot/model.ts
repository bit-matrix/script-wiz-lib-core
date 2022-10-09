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

export enum VM_NETWORK {
  BTC = "BTC",
  LIQUID = "LIQUID",
}

export enum VM_NETWORK_VERSION {
  SEGWIT = "00",
  TAPSCRIPT = "01",
}

export type VM = {
  network: VM_NETWORK;
  ver: VM_NETWORK_VERSION;
};
