import { TxData } from "./model";
import { VM_NETWORK } from "./taproot/model";
export declare const segwitSerialization: (data: TxData) => string;
export declare const taprootSerialization: (data: TxData, script: string, network: VM_NETWORK) => string;
