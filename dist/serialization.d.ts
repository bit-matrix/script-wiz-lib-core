import { SIGHASH_TYPE } from "./crypto";
import { TxData } from "./model";
import { VM_NETWORK } from "./taproot/model";
export declare const segwitSerialization: (data: TxData, sighashType: SIGHASH_TYPE, codeSeperator: string) => string;
export declare const taprootSerialization: (data: TxData, script: string, network: VM_NETWORK, sighashType: SIGHASH_TYPE, codeSeperator: string) => string;
