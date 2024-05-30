import crypto from "crypto";
import { Level } from "level";
import _ from "lodash";
import Transaction from "./transaction.js";

class Wallet
{
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public db: any;
	sublevel: string;
	constructor ( leveldb: Level<string, BlockData> )
	{
		this.sublevel = "wallet";
		this.db = leveldb.sublevel<string, UserWallet>( this.sublevel, { valueEncoding: "json" });
	}

	async allWallets (): Promise<AllWallets>
	{
		const result = await this.db.iterator().all();
		return _.fromPairs( result );
	}

	async processTrxActionList ( transactionList: TransactionData[] ): Promise<PutAction[]>
	{
		const actionList: PutAction[] = [];
		for ( const tmpTrx of transactionList )
		{
			const trx = new Transaction( tmpTrx );
			if ( trx.isCoinBase() )
			{
				const action = await this.addBalance( trx.to, trx.amount );
				actionList.push( action );
				continue;
			}
			if ( trx.from !== null )
			{
				const action = await this.minusBalance( trx.from, trx.amount + trx.fee );
				actionList.push( action );
			}
			const action = await this.addBalance( trx.to, trx.amount );
			actionList.push( action );
		}
		return actionList;
	}

	async cleanupTransactions ( transactions: TransactionData[] ): Promise<TransactionData[]>
	{
		const newTransactions: TransactionData[] = [];
		const wallets = await this.allWallets();
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
					const userWallet = await this.getBalance( trx.from );
					if ( trx.transaction_number <= userWallet.transaction_number )
					{
						console.warn( "Dropping transaction with transaction number less than wallet transaction number" );
						continue;
					}
					minusBalance( trx.from, trx.amount + trx.fee );
				}
				await addBalance( trx.to, trx.amount );
				newTransactions.push( trx.data );
			}
			catch ( error )
			{
				console.error( error );
			}
		}
		return newTransactions;

		function minusBalance ( address: string, amount: number )
		{
			if ( !wallets[address] )
			{
				wallets[address] = {
					balance: 0,
					transaction_number: 0
				};
			}
			if ( wallets[address].balance < amount )
			{
				throw new Error( "Insufficient balance", { cause: { address, amount } });
			}
			wallets[address].balance -= amount;
			wallets[address].transaction_number++;
		}

		function addBalance ( address: string, amount: number )
		{
			if ( !wallets[address] )
			{
				wallets[address] = {
					balance: 0,
					transaction_number: 0
				};
			}
			wallets[address].balance += amount;
		}
	}

	async getBalance ( address: string ): Promise<UserWallet>
	{
		const wallet = await this.db.get( address.toString() );
		return wallet;
	}

	async addBalance ( address: string, amount: number ): Promise<PutAction>
	{
		await this.validateAddress( address );
		const wallet = await this.getBalance( address );
		wallet.balance += amount;
		const action: PutAction = {
			type: "put",
			sublevel: this.sublevel,
			key: address,
			value: wallet
		};
		return action;
	}

	async minusBalance ( address: string, amount: number ): Promise<PutAction>
	{
		await this.validateAddress( address );
		const wallet = await this.getBalance( address );
		if ( wallet.balance < amount )
		{
			throw new Error( "Insufficient balance", { cause: { address, amount } });
		}
		wallet.balance -= amount;
		wallet.transaction_number++;
		const action: PutAction = {
			type: "put",
			sublevel: this.sublevel,
			key: address,
			value: wallet
		};
		return action;
	}

	async validateAddress ( address: string ): Promise<void>
	{
		if ( !await this.getBalance( address ) )
		{
			await this.db.put( address, { balance: 0, transaction_number: 0 });
		}
	}

	async isTransactionNumberCorrect ( address: string, transaction_number: number ): Promise<void>
	{
		const wallet = await this.getBalance( address );
		if ( transaction_number <= wallet.transaction_number )
		{
			throw new Error( "Invalid transaction number", { cause: { address, transaction_number } });
		}
	}

	reCalculateWallet ( chain: BlockData[] ): void
	{
		this.wipe();
		for ( const block of chain )
		{
			this.processTrxActionList( block.transactions );
		}
	}

	async wipe (): Promise<void>
	{
		await this.db.clear();
	}

	static generateKeyPair (): KeyPair
	{
		const keyPair = crypto.generateKeyPairSync( "ed25519" );
		const publicKey = keyPair.publicKey.export({ type: "spki", format: "pem" }).toString();
		const privateKey = keyPair.privateKey.export({ type: "pkcs8", format: "pem" }).toString();
		return { publicKey, privateKey };
	}
}

export default Wallet;

