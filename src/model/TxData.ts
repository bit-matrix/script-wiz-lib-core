export type TxInput = {
  previousTxId: string;
  vout: string;
  sequence: string;
  scriptPubKey: string;
  amount: string;
  assetId?: string;
  blockHeight?: string;
  blockTimestamp?: string;
};

export type TxOutput = {
  scriptPubKey: string;
  amount: string;
  assetId?: string;
  assetCommitment?: string;
  valueCommitment?: string;
};

export type TxData = {
  inputs: TxInput[];
  outputs: TxOutput[];
  version: string;
  timelock: string;
  currentInputIndex: number;
};
