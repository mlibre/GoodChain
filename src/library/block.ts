import _ from "lodash";
import Transaction from "./transaction.js";
import { computeHash } from "./utils.js";

export function verifyBlock ( currentBlock: BlockData, previousBlock: BlockData ): void
{
	const blockWithoutHash = _.omit( currentBlock, [ "hash" ] );
	if ( currentBlock.hash !== computeHash( blockWithoutHash ) )
	{
		throw new Error( "Invalid block hash" );
	}
	if ( blockWithoutHash.chainName !== previousBlock.chainName )
	{
		throw new Error( "Invalid chain name" );
	}
	if ( blockWithoutHash.index !== previousBlock.index + 1 )
	{
		throw new Error( "Invalid index" );
	}
	if ( previousBlock.hash !== currentBlock.previousHash )
	{
		throw new Error( "Invalid previous hash" );
	}

	if ( currentBlock.timestamp < previousBlock.timestamp )
	{
		throw new Error( "Block timestamp must be greater than previous block timestamp" );
	}
	for ( const transaction of currentBlock.transactions )
	{
		const transactionInstance = new Transaction( transaction );
		transactionInstance.validate();
	}
}

export function verifyGenesisBlock ( block: BlockData ): void
{
	const blockWithoutHash = _.omit( block, [ "hash" ] );
	if ( block.hash !== computeHash( blockWithoutHash ) )
	{
		throw new Error( "Invalid block hash" );
	}
}

export function blockify ( data: BlockData ): BlockData
{
	return JSON.parse( JSON.stringify( data ) );
}