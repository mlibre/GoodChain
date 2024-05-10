interface WalletData {
	blockNumber: number;
	list:	Record<string, {
		balance: number;
		transaction_number: number;
	}>;
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