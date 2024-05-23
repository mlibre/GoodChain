import Transaction from "./transaction.js";
import { initJsonFile, generateFilePath, updateFile } from "./utils.js";

class Wallet
{
	private filePath: string;
	private wallet: WalletData;

	constructor ( folderPath: string )
	{
		this.filePath = generateFilePath( folderPath, "wallet", "wallet.json" );
		this.wallet = initJsonFile( this.filePath, { blockNumber: -1, list: {} });
	}

	get allData (): WalletData
	{
		return this.wallet;
	}

	performTransactions ( transactionList: TransactionData[] ): TransactionData[]
	{
		for ( const tmpTrx of transactionList )
		{
			const trx = new Transaction( tmpTrx );
			if ( trx.isCoinBase() )
			{
				this.addBalance( trx.to, trx.amount );
				continue;
			}
			if ( trx.from !== null )
			{
				this.minusBalance( trx.from, trx.amount + trx.fee );
				this.incrementTN( trx.from );
			}
			this.addBalance( trx.to, trx.amount );
		}
		this.wallet.blockNumber++;
		this.updateDB();
		return transactionList;
	}

	cleanupTransactions ( transactions: TransactionData[] ): TransactionData[]
	{
		const newTransactions: TransactionData[] = [];
		for ( const tmpTrx of transactions )
		{
			try
			{
				const trx = new Transaction( tmpTrx );
				if ( trx.isCoinBase() )
				{
					console.warn( "Dropping coinbase transaction" );
					continue;
				}
				if ( trx.from !== null )
				{
					if ( trx.transaction_number <= this.transactionNumber( trx.from ) )
					{
						console.warn( "Dropping transaction with transaction number less than wallet transaction number" );
						continue;
					}
					this.minusBalance( trx.from, trx.amount + trx.fee );
					this.incrementTN( trx.from );
				}
				this.addBalance( trx.to, trx.amount );
				newTransactions.push( trx.data );
			}
			catch ( error )
			{
				console.error( error );
			}
		}
		this.reloadDB();
		return newTransactions;
	}

	incrementTN ( address: string ): number
	{
		this.validateAddress( address );
		return ++this.wallet.list[address].transaction_number;
	}

	balance ( address: string ): number
	{
		return this.wallet.list[address].balance;
	}

	addBalance ( address: string, amount: number ): number
	{
		this.validateAddress( address );
		return this.wallet.list[address].balance += amount;
	}

	minusBalance ( address: string, amount: number ): number
	{
		this.validateAddress( address );
		if ( this.balance( address ) < amount )
		{
			throw new Error( "Insufficient balance", { cause: { address, amount } });
		}
		return this.wallet.list[address].balance -= amount;
	}

	transactionNumber ( address: string ): number
	{
		return this.wallet.list[address].transaction_number;
	}

	validateAddress ( address: string ): void
	{
		if ( !this.wallet.list[address] )
		{
			this.wallet.list[address] = { balance: 0, transaction_number: 0 };
		}
	}

	isTransactionNumberCorrect ( address: string, transaction_number: number ): void
	{
		if ( transaction_number <= this.transactionNumber( address ) )
		{
			throw new Error( "Invalid transaction number", { cause: { address, transaction_number } });
		}
	}

	checkFinalDBState ( proposedBlock: BlockData ): void
	{
		this.reloadDB();
		if ( this.wallet.blockNumber !== proposedBlock.index )
		{
			throw new Error( "Block number mismatch", { cause: { proposedBlock, wallet: this.wallet } });
		}
	}

	reCalculateWallet ( chain: BlockData[] ): void
	{
		this.wipe();
		for ( const block of chain )
		{
			this.performTransactions( block.transactions );
		}
	}

	reloadDB (): void
	{
		this.wallet = initJsonFile( this.filePath, { blockNumber: 0, list: {} });
	}

	wipe (): void
	{
		this.wallet = { blockNumber: -1, list: {} };
		this.updateDB();
	}

	updateDB (): void
	{
		updateFile( this.filePath, this.wallet );
	}
}

export default Wallet;

