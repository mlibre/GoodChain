const { hashDataObject } = require( "./utils" )
const Transaction = require( "./transactions" )
const _ = require( "lodash" );

class Block
{
	constructor ({	index, chainName, timestamp, nonce, previousHash, transactions, hash, miner, difficulty })
	{
		this.index = index;
		this.chainName = chainName;
		this.timestamp = timestamp || Date.now();
		this.transactions = transactions;
		this.previousHash = previousHash || "";
		this.hash = hash;
		this.nonce = nonce;
		this.miner = miner;
		this.difficulty = difficulty;
	}
	get data ()
	{
		return Block.pickData( this );
	}
	get all ()
	{
		const self = this
		return { ...Block.pickData( this ), hash: self.hash };
	}
	mine ( )
	{
		this.nonce = 0;
		this.hash = hashDataObject( this.data );
		while ( this.hash.localeCompare( this.difficulty ) != -1 )
		{
			this.nonce++;
			this.hash = hashDataObject( this.data );
		}
		return this.nonce
	}
	static pickData ( block )
	{
		return _.pick( block, [ "index", "chainName", "timestamp", "transactions", "previousHash", "nonce", "miner", "difficulty" ] );
	}
	static verify ( block, previousBlock )
	{
		const normalizedBlock = Block.pickData( block )
		if ( normalizedBlock.index !== previousBlock.index + 1 )
		{
			throw new Error( "Invalid index" );
		}
		if ( block.hash !== hashDataObject( normalizedBlock ) )
		{
			throw new Error( "Invalid block hash" );
		}
		if ( block.index !== 0 )
		{
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