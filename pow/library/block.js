const { hashDataObject, objectify } = require( "./utils" )
const Transaction = require( "./transactions" )
const _ = require( "lodash" );

class Block
{
	constructor ({	index, chainName, timestamp, nonce, previousHash, transactions, hash, miner })
	{
		const self = this
		self.index = index;
		self.chainName = chainName;
		self.timestamp = timestamp || Date.now();
		self.transactions = transactions;
		self.previousHash = previousHash || "";
		self.hash = hash;
		self.nonce = nonce;
		self.miner = miner;
	}
	get data ()
	{
		return _.omit( this, [ "hash" ] );
	}
	get all ()
	{
		return objectify( this )
	}
	mine ( )
	{
		this.hash = hashDataObject( this.data );
		return this.hash
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