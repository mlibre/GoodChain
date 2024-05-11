interface BlockchainConstructorParams {
  dbPath: string;
  nodes: {
    list: string[];
    hostUrl: string;
  };
  chainName: string;
  minerKeys: {
    publicKey: string;
    privateKey: string;
  };
  consensus: Consensus;
}

interface WalletData {
	blockNumber: number;
	list:	Record<string, {
		balance: number;
		transaction_number: number;
	}>;
}

interface BlockData {
  hash?: string;
  index: number;
  chainName: string;
  previousHash: string;
  timestamp: number;
  consensusDifficulty: string;
  consensusName: string;
  consensusTotalDifficulty: string;
  consensusHash: string;
  consensusNonce: number;
  transactions: TransactionData[];
}

interface TransactionData {
  from: string;
  to: string;
  amount: number;
  fee: number;
  transaction_number: number;
  signature: string;
  id: string;
}

interface TransactionDataWithoutSignature {
  from: string;
  to: string;
  amount: number;
  fee: number;
  transaction_number: number;
  id: string;
}