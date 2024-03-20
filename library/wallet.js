const { initJsonFile, updateFile } = require( "./utils" )
const Transaction = require( "./transactions" )

class Wallet
{
	constructor ( filePath, wallet )
	{
		this.filePath = filePath;
		this.wallet = structuredClone( wallet ) || initJsonFile( filePath, {});
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
		this.wallet.blockNumber = ( this.wallet.blockNumber || -1 ) + 1
		this.updateDB()
		return transactionList;
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

	checkDB ( proposedBlock )
	{
		this.reloadDB()
		if ( this.wallet.blockNumber !== proposedBlock.index )
		{
			throw new Error( "Block number mismatch", { cause: { proposedBlock, wallet: this.wallet } });
		}
	}

	reloadDB ( )
	{
		this.wallet = initJsonFile( this.filePath, { blockNumber: 0 });
	}

}


module.exports = Wallet