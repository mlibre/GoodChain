import _ from "lodash";
import Transaction from "./transactions.js";
import { hashDataObject } from "./utils.js";

export function verifyBlock ( block: BlockData, previousBlock: BlockData ): void
{
	const normalizedBlock = _.omit( block, [ "hash" ] );
	if ( block.hash !== hashDataObject( normalizedBlock ) )
	{
		throw new Error( "Invalid block hash" );
	}
	if ( normalizedBlock.chainName !== previousBlock.chainName )
	{
		throw new Error( "Invalid chain name" );
	}
	if ( normalizedBlock.index !== previousBlock.index + 1 )
	{
		throw new Error( "Invalid index" );
	}
	if ( previousBlock.hash !== block.previousHash )
	{
		throw new Error( "Invalid previous hash" );
	}

	if ( block.timestamp < previousBlock.timestamp )
	{
		throw new Error( "Block timestamp must be greater than previous block timestamp" );
	}
	for ( const transaction of block.transactions )
	{
		const transactionInstance = new Transaction( transaction );
		transactionInstance.validate();
	}
}

export function verifyGenesisBlock ( block: BlockData ): void
{
	const normalizedBlock = _.omit( block, [ "hash" ] );
	if ( block.hash !== hashDataObject( normalizedBlock ) )
	{
		throw new Error( "Invalid block hash" );
	}
}

export function blockify ( data: BlockData ): BlockData
{
	return JSON.parse( JSON.stringify( data ) );
}