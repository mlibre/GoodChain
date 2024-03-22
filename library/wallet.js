const path = require( "path" );
const { initJsonFile, updateFile, makeFilePath } = require( "./utils" )
const Transaction = require( "./transactions" )

class Wallet
{
	constructor ( folderPath )
	{
		this.filePath = makeFilePath( folderPath, "wallet", "wallet.json" );
		this.wallet = initJsonFile( this.filePath, { blockNumber: -1 });
	}

	get list ()
	{
		return this.wallet;
	}

	get ( address )
	{
		return this.wallet[address];
	}

	performTransactions ( transactionList )
	{
		for ( const tmpTrx of transactionList )
		{
			const trx = new Transaction( tmpTrx );
			if ( trx.isCoinBase( ) )
			{
				this.addBalance( trx.to, trx.amount );
				continue
			}
			this.minusBalance( trx.from, trx.amount + trx.fee );
			this.incrementTN( trx.from );
			this.addBalance( trx.to, trx.amount );
		}
		this.wallet.blockNumber = this.wallet.blockNumber + 1
		this.updateDB()
		return transactionList;
	}

	cleanupTransactions ( transactions )
	{
		const newTransactions = []
		for ( const tmpTrx of transactions )
		{
			try
			{
				const trx = new Transaction( tmpTrx );
				if ( trx.isCoinBase( ) )
				{
					console.log( "Dropping coinbase transaction" );
					continue
				}
				if ( trx.transaction_number <= this.transactionNumber( trx.from ) )
				{
					console.log( "Dropping transaction with transaction number less than wallet transaction number" );
					continue
				}
				this.minusBalance( trx.from, trx.amount + trx.fee );
				this.incrementTN( trx.from );
				this.addBalance( trx.to, trx.amount );
				newTransactions.push( trx.data );
			}
			catch ( error )
			{
				console.log( error );
			}
		}
		this.reloadDB()
		return newTransactions
	}

	incrementTN ( address )
	{
		this.validateAddress( address )
		return ++this.wallet[address].transaction_number;
	}

	balance ( address )
	{
		return this.wallet[address].balance
	}

	addBalance ( address, amount )
	{
		this.validateAddress( address )
		return this.wallet[address].balance += amount;
	}

	minusBalance ( address, amount )
	{
		if ( this.balance( address ) < amount )
		{
			throw new Error( "Insufficient balance", { cause: { address, amount } });
		}
		return this.wallet[address].balance -= amount;
	}

	transactionNumber ( address )
	{
		return this.wallet[address].transaction_number;
	}

	validateAddress ( address )
	{
		if ( address )
		{
			this.wallet[address] = this.wallet[address] || { balance: 0, transaction_number: 0 };
		}
	}

	updateDB ( )
	{
		updateFile( this.filePath, this.wallet );
	}

	wipe ()
	{
		this.wallet = {};
		this.updateDB( )
	}

	reloadDB ( )
	{
		this.wallet = initJsonFile( this.filePath, { blockNumber: 0 });
	}

	reCalculateWallet ( chain )
	{
		this.wipe()
		for ( const block of chain )
		{
			this.performTransactions( block.transactions );
		}
	}

	checkDB ( proposedBlock )
	{
		this.reloadDB()
		if ( this.wallet.blockNumber !== proposedBlock.index )
		{
			throw new Error( "Block number mismatch", { cause: { proposedBlock, wallet: this.wallet } });
		}
	}
}


module.exports = Wallet