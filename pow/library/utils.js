const fs = require( "fs" );
const crypto = require( "crypto" );

exports.initJsonFile = function initJsonFile ( path, defaultData = {})
{
	if ( fs.existsSync( path ) )
	{
		return JSON.parse( fs.readFileSync( path ) );
	}
	else
	{
		fs.writeFileSync( path, JSON.stringify( defaultData, null, "\t" ) );
		return defaultData
	}
}

exports.updateFile = function updateFile ( path, data )
{
	fs.writeFileSync( path, JSON.stringify( data, null, "\t" ) );
}

exports.calculateMiningFee = function calculateMiningFee ( transactionPool )
{
	return transactionPool.reduce( ( totalFee, transaction ) =>
	{
		return totalFee + transaction.fee;
	}, 0 );
}

exports.hashDataObject = function ( data )
{
	const stringData = JSON.stringify( data )
	return crypto
	.createHash( "sha256" )
	.update( stringData )
	.digest( "hex" );
}

exports.isCoinBase = function ({ from, signature })
{
	if ( !from && !signature )
	{
		return true;
	}
	return false
}

exports.deleteDbFile = function ( filePath )
{
	try
	{
		if ( fs.existsSync( filePath ) )
		{
			fs.unlinkSync( filePath );
			console.log( `Deleted ${filePath}` );
		}
		else
		{
			console.log( `${filePath} does not exist.` );
		}
	}
	catch ( error )
	{
		console.error( `Error deleting ${filePath}:`, error );
	}
}

exports.proccessTransaction = function ( transactions, wallet )
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