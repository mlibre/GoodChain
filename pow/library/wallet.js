const crypto = require( "crypto" );
const { initJsonFile, isCoinBase } = require( "./utils" )

class Wallet
{
	constructor ( filePath )
	{
		this.filePath = filePath;
		this.wallets = initJsonFile( filePath );
	}

	update ( transactions )
	{
		for ( const trx of transactions )
		{
			if ( !isCoinBase( trx ) )
			{
				this.minusBalance( trx.from, trx.amount + trx.fee );
				this.incrementTN( trx.from );
			}
			this.addBalance( trx.to, trx.amount );
		}
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
		this.wallets[address] = this.wallets[address] || { balance: 0, transaction_number: 0 };
	}

	static createKeyPair ()
	{
		const keyPair = crypto.generateKeyPairSync( "rsa", { modulusLength: 512 });
		const publicKey = keyPair.publicKey.export({ type: "pkcs1", format: "pem" });
		const privateKey = keyPair.privateKey.export({ type: "pkcs1", format: "pem" });

		let publicKeyString = publicKey.replace( /-----BEGIN RSA PUBLIC KEY-----/, "" ); // remove header
		publicKeyString = publicKeyString.replace( /-----END RSA PUBLIC KEY-----/, "" ); // remove footer
		publicKeyString = publicKeyString.replace( /\n/g, "" ); // remove newlines

		return { publicKey, privateKey, publicKeyString };
	}
}


module.exports = Wallet