export declare type TxInput = {
    previousTxId: string;
    vout: string;
    sequence: string;
    scriptPubKey: string;
    amount: string;
};
export declare type TxInputLiquid = TxInput & {
    assetId?: string;
    assetCommitment?: string;
    valueCommitment?: string;
    confidental: boolean;
};
export declare type TxOutput = {
    scriptPubKey: string;
    amount: string;
};
export declare type TxOutputLiquid = TxOutput & {
    assetId?: string;
    assetCommitment?: string;
    valueCommitment?: string;
    confidental: boolean;
};
export declare type TxData = {
    inputs: TxInput[] | TxInputLiquid[];
    outputs: TxOutput[] | TxOutputLiquid[];
    version: string;
    timelock: string;
    currentInputIndex: number;
    blockHeight: string;
    blockTimestamp: string;
};
