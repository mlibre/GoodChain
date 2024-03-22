const _ = require( "lodash" );
const Transaction = require( "./transactions" )
const { hashDataObject } = require( "./utils" )

class Block
{
	constructor ()
	{
		// const self = this
	}

	static verify ( block, previousBlock )
	{
		const normalizedBlock = _.omit( block, [ "hash" ] );
		if ( block.hash !== hashDataObject( normalizedBlock ) )
		{
			throw new Error( "Invalid block hash" );
		}
		if ( block.index !== 0 )
		{
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
			for ( let i = 0; i < block.transactions.length; i++ )
			{
				const transaction = new Transaction( block.transactions[i] );
				transaction.validate( )
			}
		}
	}
}

module.exports = Block;