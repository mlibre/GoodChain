import crypto from "crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, unlinkSync, writeFileSync } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export function calculateMiningFee ( transactionPool: { fee: number }[] ): number
{
	return transactionPool.reduce( ( totalFee, transaction ) =>
	{
		return totalFee + transaction.fee;
	}, 0 );
}

export function computeHash ( data: object ): string
{
	const stringData = JSON.stringify( data );
	return crypto
	.createHash( "sha256" )
	.update( stringData )
	.digest( "hex" );
}

export function initJsonFile ( filePath: string, defaultData: object = {})
{
	const folderPath = path.dirname( filePath );
	if ( !existsSync( folderPath ) )
	{
		mkdirSync( folderPath, { recursive: true });
	}

	if ( existsSync( filePath ) )
	{
		return JSON.parse( readFileSync( filePath, "utf8" ) );
	}
	else
	{
		writeFileSync( filePath, JSON.stringify( defaultData, null, "\t" ) );
		return defaultData;
	}
}

export function updateFile ( filePath: string, data: object ): void
{
	writeFileSync( filePath, JSON.stringify( data, null, "\t" ) );
}

export function deleteFile ( filePath: string ): void
{
	try
	{
		if ( existsSync( filePath ) )
		{
			unlinkSync( filePath );
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
	if ( existsSync( folderPath ) )
	{
		rmSync( folderPath, { recursive: true, force: true });
	}
}

export function createFolder ( folderPath: string ): boolean
{
	if ( !existsSync( folderPath ) )
	{
		mkdirSync( folderPath, { recursive: true });
		console.log( `Folder ${folderPath} Created` );
		return true;
	}
	else
	{
		console.warn( `Folder ${folderPath} already exists` );
		return false;
	}
}

export function generateUuid (): string
{
	return uuidv4();
}

export function generateFilePath ( folderPath: string, ...params: string[] ): string
{
	return path.join( folderPath, ...params );
}