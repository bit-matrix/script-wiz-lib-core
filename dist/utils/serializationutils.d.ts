import { TxInput, TxOutput } from "../model";
export declare const calculateHashOutputs: (outputs: TxOutput[], isSegwit?: boolean) => string;
export declare const calculatePrevouts: (inputs: TxInput[], isSegwit?: boolean) => string;
export declare const calculateInputAmounts: (inputs: TxInput[]) => string;
export declare const calculateInputScriptPubkeys: (inputs: TxInput[]) => string;
export declare const calculateInputSequences: (inputs: TxInput[]) => string;
export declare const emptyUnit = "00000000000000000000000000000000";
