const fs = require( "fs" );
const path = require( "path" );
const crypto = require( "crypto" );
const { v4: uuidv4 } = require( "uuid" );

exports.initJsonFile = function initJsonFile ( filePath, defaultData = {})
{
	const folderPath = path.dirname( filePath );
	if ( !fs.existsSync( folderPath ) )
	{
		fs.mkdirSync( folderPath, { recursive: true });
	}

	if ( fs.existsSync( filePath ) )
	{
		return JSON.parse( fs.readFileSync( filePath ) );
	}
	else
	{
		fs.writeFileSync( filePath, JSON.stringify( defaultData, null, "\t" ) );
		return defaultData;
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
	// the sha256 hash generates fixed length output of 32 bytes, 64 characters
	const stringData = JSON.stringify( data )
	return crypto
	.createHash( "sha256" )
	.update( stringData )
	.digest( "hex" );
}

exports.objectify = function ( data )
{
	return JSON.parse( JSON.stringify( data ) );
}

exports.deleteFile = function ( filePath )
{
	try
	{
		if ( fs.existsSync( filePath ) )
		{
			fs.unlinkSync( filePath );
			console.log( `File ${filePath} Deleted` );
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

exports.deleteFoler = function ( folderPath )
{
	if ( fs.existsSync( folderPath ) )
	{
		fs.rmdirSync( folderPath, { recursive: true });
	}
}

exports.recreateFolder = function ( folderPath )
{
	if ( fs.existsSync( folderPath ) )
	{
		fs.rmdirSync( folderPath, { recursive: true });
		console.log( `Folder ${folderPath} Deleted` );
	}
	fs.mkdirSync( folderPath );
	console.log( `Folder ${folderPath} Created` );
}

exports.createFolder = function ( folderPath )
{
	if ( !fs.existsSync( folderPath ) )
	{
		fs.mkdirSync( folderPath );
		console.log( `Folder ${folderPath} Created` );
	}
	else
	{
		console.log( `Folder ${folderPath} already exists` );
		return false;
	}
}

exports.uuid = function ()
{
	return uuidv4();
}

exports.createKeyPair = function ()
{
	const keyPair = crypto.generateKeyPairSync( "ed25519" );
	const publicKey = keyPair.publicKey.export({ type: "spki", format: "pem" });
	const privateKey = keyPair.privateKey.export({ type: "pkcs8", format: "pem" });

	const publicKeyString = exports.removePublicKeyHeaders( publicKey )

	return { publicKey, privateKey, publicKeyString };
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