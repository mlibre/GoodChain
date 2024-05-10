declare interface WalletData {
	blockNumber: number;
	list: Record<string, {
			balance: number;
			transaction_number: number;
		}>;
	}