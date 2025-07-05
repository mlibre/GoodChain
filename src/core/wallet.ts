import crypto from "crypto";
import { Level } from "level";
import _ from "lodash";
import Transaction from "./transaction.js";

class Wallet
{
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public db: any;
	cacheWallet: AllWallets;
	constructor ( leveldb: Level<string, BlockData> )
	{
		this.db = leveldb.sublevel<string, UserWallet>( "wallet", { valueEncoding: "json" });
		this.cacheWallet = {};
	}

	async allWallets (): Promise<AllWallets>
	{
		const result = await this.db.iterator().all();
		return _.fromPairs( result );
	}

	async processTrxActionList ( transactionList: TransactionData[] ): Promise<PutAction[]>
	{
		this.cacheWallet = {};
		const actionList: PutAction[] = [];
		for ( const tmpTrx of transactionList )
		{
			const trx = new Transaction( tmpTrx );
			trx.validate();
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
		this.cacheWallet = {};
		return actionList;
	}

	async cleanupTransactions ( transactions: TransactionData[] ): Promise<TransactionData[]>
	{
		this.cacheWallet = {};
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
					const userWallet = await this.getBalance( trx.from );
					if ( trx.transaction_number <= userWallet.transaction_number )
					{
						console.warn( "Dropping transaction with transaction number less than wallet transaction number" );
						continue;
					}
					await this.minusBalance( trx.from, trx.amount + trx.fee );
				}
				await this.addBalance( trx.to, trx.amount ); // todo you can use this.addbalance again
				newTransactions.push( trx.data );
			}
			catch ( error )
			{
				console.error( error );
			}
		}
		this.cacheWallet = {};
		return newTransactions;
	}

	async getBalance ( address: string ): Promise<UserWallet>
	{
		if ( this.cacheWallet[address] )
		{
			return this.cacheWallet[address];
		}
		try
		{
			let wallet = await this.db.get( address.toString() );
			if ( wallet == undefined )
			{
				await this.db.put( address, { balance: 0, transaction_number: 0 });
				wallet = await this.db.get( address.toString() );
			}
			this.cacheWallet[address] = wallet;
			return wallet;
		}
		catch ( error )
		{
			console.log( error );
			throw error;
		}
	}

	async addBalance ( address: string, amount: number ): Promise<PutAction>
	{
		const wallet = await this.getBalance( address );
		wallet.balance += amount;
		const action: PutAction = {
			type: "put",
			sublevel: this.db,
			key: address,
			value: wallet
		};
		return action;
	}

	async minusBalance ( address: string, amount: number ): Promise<PutAction>
	{
		const wallet = await this.getBalance( address );
		if ( wallet.balance < amount )
		{
			throw new Error( "Insufficient balance", { cause: { address, amount } });
		}
		wallet.balance -= amount;
		wallet.transaction_number++;
		const action: PutAction = {
			type: "put",
			sublevel: this.db,
			key: address,
			value: wallet
		};
		return action;
	}

	async isTransactionNumberCorrect ( address: string, transaction_number: number ): Promise<void>
	{
		const wallet = await this.getBalance( address );
		if ( transaction_number <= wallet.transaction_number )
		{
			throw new Error( "Invalid transaction number", { cause: { address, transaction_number } });
		}
	}

	async reCalculateWallet ( chain: BlockData[] ): Promise<void>
	{
		await this.wipe();
		const allActions: PutAction[] = [];
		for ( const block of chain )
		{
			 const blockActions = await this.processTrxActionList( block.transactions );
			 allActions.push( ...blockActions );
		}
		await this.db.batch( allActions ); // Commit all actions at once
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

