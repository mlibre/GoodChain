const { hashDataObject } = require( "./utils" )
const transaction = require( "./transactions" )

class Block
{
	constructor ({	index, nonce, previousHash, transactions,	hash,	miner, difficulty	})
	{
		this.index = index;
		this.timestamp = Date.now();
		this.transactions = transactions;
		this.previousHash = previousHash || "";
		this.hash = hash;
		this.nonce = nonce;
		this.miner = miner;
		this.difficulty = difficulty;
	}
	get data ()
	{
		return {
			index: this.index,
			timestamp: this.timestamp,
			transactions: this.transactions,
			previousHash: this.previousHash,
			nonce: this.nonce,
			miner: this.miner,
			difficulty: this.difficulty
		};
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
	static verify ( block, previousBlock )
	{
		const tmpBlock = {
			index: block.index,
			timestamp: block.timestamp,
			transactions: block.transactions,
			previousHash: block.previousHash,
			nonce: block.nonce,
			miner: block.miner,
			difficulty: block.difficulty
		};
		if ( block.hash !== hashDataObject( tmpBlock ) )
		{
			throw new Error( "Invalid block hash" );
		}
		if ( block.index !== 0 )
		{
			if ( previousBlock.hash !== block.previousHash )
			{
				throw new Error( "Invalid previous hash" );
			}

			if ( block.timestamp <= previousBlock.timestamp )
			{
				throw new Error( "Block timestamp must be greater than previous block timestamp" );
			}
		}

	}
}

module.exports = Block;