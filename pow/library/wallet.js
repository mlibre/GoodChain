const { initJsonFile } = require( "./utils" )

class Wallet
{
	constructor ( filePath )
	{
		this.filePath = filePath;
		this.wallets = initJsonFile( filePath );
	}
	get list ()
	{
		return this.wallets;
	}
	get ( address )
	{
		return this.wallets[address];
	}

	incrementTN ( address )
	{
		this.validateAddress( address )
		return ++this.wallets[address].transaction_number;
	}

	balance ( address )
	{
		return this.wallets[address].balance
	}

	addBalance ( address, amount )
	{
		this.validateAddress( address )
		return this.wallets[address].balance += amount;
	}

	minusBalance ( address, amount )
	{
		return this.wallets[address].balance -= amount;
	}

	hasEnoughBalance ( address, amount )
	{
		return this.balance( address ) >= amount;
	}

	transactionNumber ( address )
	{
		return this.wallets[address].transaction_number;
	}

	validateAddress ( address )
	{
		if ( address )
		{
			this.wallets[address] = this.wallets[address] || { balance: 0, transaction_number: 0 };
		}
	}
}


module.exports = Wallet