const fs = require( "fs" );
const crypto = require( "crypto" );
const { v4: uuidv4 } = require( "uuid" );

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

exports.deleteFile = function ( filePath )
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

exports.uuid = function ()
{
	return uuidv4();
}

exports.removePublicKeyHeaders = function ( publicKey )
{
	const headerRegex = /^-----BEGIN PUBLIC KEY-----\r?\n/;
	const footerRegex = /\n-----END PUBLIC KEY-----/;

	const strippedPublicKey = publicKey.replace( headerRegex, "" );
	return strippedPublicKey.replace( footerRegex, "" );
}

exports.addPublicKeyHeaders = function ( publicKey )
{
	return `-----BEGIN PUBLIC KEY-----\n${publicKey}-----END PUBLIC KEY-----`;
}