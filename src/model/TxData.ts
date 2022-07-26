export type TxInput = {
  previousTxId: string;
  vout: string;
  sequence: string;
  scriptPubKey: string;
  amount: string;
};

export type TxInputLiquid = TxInput & {
  assetId?: string;
  assetCommitment?: string;
  valueCommitment?: string;
  confidental: boolean;
};

export type TxOutput = {
  scriptPubKey: string;
  amount: string;
};

export type TxOutputLiquid = TxOutput & {
  assetId?: string;
  assetCommitment?: string;
  valueCommitment?: string;
  confidental: boolean;
};

export type TxData = {
  inputs: TxInput[] | TxInputLiquid[];
  outputs: TxOutput[] | TxOutputLiquid[];
  version: string;
  timelock: string;
  currentInputIndex: number;
  blockHeight: string;
  blockTimestamp: string;
};
