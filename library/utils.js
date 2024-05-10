import fs from "fs";
import path from "path";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

export function calculateMiningFee ( transactionPool: { fee: number }[] ): number
{
	return transactionPool.reduce( ( totalFee, transaction ) =>
	{
		return totalFee + transaction.fee;
	}, 0 );
}

export function hashDataObject ( data: any ): string
{
	const stringData = JSON.stringify( data );
	return crypto
	.createHash( "sha256" )
	.update( stringData )
	.digest( "hex" );
}

export function objectify ( data: any ): any
{
	return JSON.parse( JSON.stringify( data ) );
}

export function initJsonFile ( filePath: string, defaultData: any = {}): any
{
	const folderPath = path.dirname( filePath );
	if ( !fs.existsSync( folderPath ) )
	{
		fs.mkdirSync( folderPath, { recursive: true });
	}

	if ( fs.existsSync( filePath ) )
	{
		return JSON.parse( fs.readFileSync( filePath, "utf8" ) );
	}
	else
	{
		fs.writeFileSync( filePath, JSON.stringify( defaultData, null, "\t" ) );
		return defaultData;
	}
}

export function updateFile ( filePath: string, data: any ): void
{
	fs.writeFileSync( filePath, JSON.stringify( data, null, "\t" ) );
}

export function deleteFile ( filePath: string ): void
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

export function deleteFolder ( folderPath: string ): void
{
	if ( fs.existsSync( folderPath ) )
	{
		fs.rmdirSync( folderPath, { recursive: true });
	}
}

export function createFolder ( folderPath: string ): boolean
{
	if ( !fs.existsSync( folderPath ) )
	{
		fs.mkdirSync( folderPath );
		console.log( `Folder ${folderPath} Created` );
		return true;
	}
	else
	{
		console.log( `Folder ${folderPath} already exists` );
		return false;
	}
}

export function generateUuid (): string
{
	return uuidv4();
}

export function createKeyPair (): {
  publicKey: string;
  privateKey: string;
  publicKeyString: string;
  }
{
	const keyPair = crypto.generateKeyPairSync( "ed25519" );
	const publicKey = keyPair.publicKey.export({ type: "spki", format: "pem" });
	const privateKey = keyPair.privateKey.export({ type: "pkcs8", format: "pem" });

	const publicKeyString = removePublicKeyHeaders( publicKey );

	return { publicKey, privateKey, publicKeyString };
}

export function removePublicKeyHeaders ( publicKey: string ): string
{
	const headerRegex = /^-----BEGIN PUBLIC KEY-----\r?\n/;
	const footerRegex = /\n-----END PUBLIC KEY-----/;

	const strippedPublicKey = publicKey.replace( headerRegex, "" );
	return strippedPublicKey.replace( footerRegex, "" );
}

export function makeFilePath ( folderPath: string, ...params: string[] ): string
{
	return path.join( folderPath, ...params );
}