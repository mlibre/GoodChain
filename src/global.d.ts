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
	index: number;
	chainName: string;
	timestamp: number;
	transactions: TransactionData[];
	previousHash: string;
	consensusDifficulty?: string;
	consensusName?: string;
	consensusTotalDifficulty?: string;
	consensusHash?: string;
	consensusNonce?: number;
	miner?: string;
	hash?: string;
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

interface ErrorWithStds {
  stderr: string;
  stdout: string;
  status?: number;
}

declare function isErrorWithStds( error: unknown ): error is ErrorWithStds
{
	return (
		typeof error === "object" &&
    error !== null &&
    "stderr" in error &&
    "stdout" in error &&
    ( "status" in error || typeof error.status === "undefined" )
	);
}