import WizData from "@script-wiz/wiz-data";
export declare type Address = {
    testnet: string;
    mainnet: string;
};
export declare type Taproot = {
    tweak: WizData;
    scriptPubkey: WizData;
    address: Address;
};
