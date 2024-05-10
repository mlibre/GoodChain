const crypto = require( "crypto" );
const { uuid } = require( "./utils" )

module.exports = class Transaction
{
	constructor ({ from, to, amount, fee, transaction_number, signature, id })
	{
		this.from = from;
		this.to = to;
		this.amount = amount;
		this.fee = fee;
		this.transaction_number = transaction_number;
		this.signature = signature;
		this.id = id || uuid()
	}
	get data ()
	{
		return {
			from: this.from,
			to: this.to,
			amount: this.amount,
			fee: this.fee,
			transaction_number: this.transaction_number,
			signature: this.signature,
			id: this.id
		};
	}
	get dataWithoutSignature ()
	{
		return {
			from: this.from,
			to: this.to,
			amount: this.amount,
			fee: this.fee,
			transaction_number: this.transaction_number,
			id: this.id
		}
	}

	validate ()
	{
		if ( this.amount < 0 )
		{
			throw new Error( "Invalid amount" );
		}
		if ( this.isCoinBase() )
		{
			return true;
		}
		if ( !this.from || !this.to )
		{
			throw new Error( "Invalid transaction" );
		}
		this.verifySignature( );
		return true;
	}

	verifySignature ( )
	{
		if ( !this.signature )
		{
			throw new Error( "No signature" );
		}
		const signature = Buffer.from( this.signature, "hex" );
		const result = crypto.verify( null, Buffer.from( JSON.stringify( this.dataWithoutSignature ) ), this.from, signature );
		if ( !result )
		{
			throw new Error( "Invalid signature" );
		}
		return result;
	}

	sign ( privateKey )
	{
		const signature = crypto.sign( null, Buffer.from( JSON.stringify( this.dataWithoutSignature ) ), privateKey );
		this.signature = signature.toString( "hex" )
		return this.signature;
	}

	isCoinBase ()
	{
		return !this.from && !this.signature;
	}
}