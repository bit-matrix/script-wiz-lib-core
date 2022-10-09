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
export declare enum VM_NETWORK {
    BTC = "BTC",
    LIQUID = "LIQUID"
}
export declare enum VM_NETWORK_VERSION {
    SEGWIT = "00",
    TAPSCRIPT = "01"
}
export declare type VM = {
    network: VM_NETWORK;
    ver: VM_NETWORK_VERSION;
};
