const crypto = require( "crypto" );
const _ = require( "lodash" );

exports.validate = function ({ from, to, amount, fee, transaction_number, signature }, wallet )
{
	if ( amount < 0 )
	{
		throw new Error( "Invalid amount" )
	}
	if ( exports.isCoinBase({ from, signature }) )
	{
		return true
	}
	if ( !from || !to )
	{
		throw new Error( "Invalid transaction" );
	}
	if ( !wallet.hasEnoughBalance( from, amount + fee ) )
	{
		throw new Error( "Insufficient balance" );
	}
	if ( transaction_number < wallet.transactionNumber( from ) )
	{
		throw new Error( "Invalid transaction number" );
	}
	exports.verifySignature( from, signature, { from, to, amount, fee, transaction_number })
	return true;
}

exports.verifySignature = function ( publicKey, signatureHex, data )
{
	data = _.pick( data, [ "from", "to", "amount", "fee", "transaction_number" ] );
	const signature = Buffer.from( signatureHex, "hex" );
	const result = crypto.verify( null, Buffer.from( JSON.stringify( data ) ), publicKey, signature );
	if ( !result )
	{
		throw new Error( "Invalid signature" );
	}
	return result;
}

exports.sign = function ( transaction, privateKey )
{
	const signature = crypto.sign( null, Buffer.from( JSON.stringify( transaction ) ), privateKey );
	return signature.toString( "hex" );
}

exports.checkPoolSize = function ( transactionPool, transactionPoolSize )
{
	if ( transactionPool.length >= transactionPoolSize )
	{
		throw new Error( "Transaction pool is full" );
	}
}

exports.isDuplicate = function ( transactionPool, { from, to, amount, fee, transaction_number, signature })
{
	const duplicate = _.find( transactionPool, { from, to, amount, fee, transaction_number, signature });
	if ( duplicate )
	{
		throw new Error( "Duplicate transaction" );
	}
}

exports.proccessTransactions = function ( transactions, wallet )
{
	const processedTransactions = [];
	for ( const trx of transactions )
	{
		if ( exports.isCoinBase( trx ) )
		{
			wallet.addBalance( trx.to, trx.amount );
			processedTransactions.push( trx );
			continue
		}
		if ( wallet.hasEnoughBalance( trx.from, trx.amount + trx.fee ) )
		{
			wallet.minusBalance( trx.from, trx.amount + trx.fee );
			wallet.incrementTN( trx.from );
			wallet.addBalance( trx.to, trx.amount );
			processedTransactions.push( trx );
		}
	}
	return processedTransactions;
}

exports.isCoinBase = function ({ from, signature })
{
	if ( !from && !signature )
	{
		return true;
	}
	return false
}