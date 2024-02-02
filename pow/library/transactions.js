const crypto = require( "crypto" );
const { isCoinBase } = require( "./utils" );
const _ = require( "lodash" );

exports.sign = function ( privateKey, transaction )
{
	const key = crypto.createPrivateKey( privateKey );
	const transactionString = JSON.stringify( transaction );
	const signatureBuffer = crypto.sign( "sha256", Buffer.from( transactionString ), key );
	return signatureBuffer.toString( "hex" );
}

exports.validate = function ({ from, to, amount, fee, transaction_number, signature }, wallet )
{
	if ( amount < 0 )
	{
		throw new Error( "Invalid amount" )
	}
	if ( isCoinBase({ from, signature }) )
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

exports.verifySignature = function verifySignature ( publicKey, signature, data )
{
	const key = crypto.createPublicKey( publicKey );
	const transactionString = JSON.stringify( data );
	const signatureBuffer = Buffer.from( signature, "hex" );
	const result = crypto.verify( "sha256", Buffer.from( transactionString ), key, signatureBuffer );
	if ( !result )
	{
		throw new Error( "Invalid signature" );
	}
	return result;
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
		if ( isCoinBase( trx ) )
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