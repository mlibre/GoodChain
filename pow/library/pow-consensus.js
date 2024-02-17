const { hashDataObject } = require( "./utils" );
const _ = require( "lodash" );

module.exports = class pow
{
	constructor ()
	{
		this.name = "pow";
		this.difficulty = "000fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
	}
	setValues ( block )
	{
		this.difficulty = block.difficulty || this.difficulty;
	}
	apply ( block, previousBlock )
	{
		block.consensusName = this.name
		block.consensusDifficulty = this.difficulty
		block.consensusNonce = 0;
		if ( block.index === 0 )
		{
			block.consensusTotalDifficulty = block.consensusDifficulty
		}
		else
		{
			const num1 = parseInt( block.consensusDifficulty, 16 );
			const num2 = parseInt( previousBlock.consensusDifficulty, 16 );
			const sum = num1 + num2;
			const sumHex = sum.toString( 16 );
			block.consensusTotalDifficulty = sumHex
		}

		let hash = hashDataObject( block )
		while ( hash.localeCompare( this.difficulty ) != -1 )
		{
			block.consensusNonce++;
			hash = hashDataObject( block );
		}
		block.consensusHash = hash;

		return block.consensusNonce
	}
	validate ( block, previousBlock )
	{
		if ( block.consensusName !== this.name )
		{
			throw new Error( "Invalid consensus name" );
		}
		if ( block.consensusDifficulty !== this.difficulty )
		{
			throw new Error( "Invalid difficulty" );
		}
		// check if hash is calculated right
		const pureObject = _.omit( block, [ "consensusHash", "hash" ] );
		const hash = hashDataObject( pureObject );
		if ( block.consensusHash.localeCompare( hash ) !== 0 )
		{
			throw new Error( "Invalid hash" );
		}
		if ( block.index !== 0 )
		{
			if ( block.consensusHash.localeCompare( block.consensusDifficulty ) !== -1 )
			{
				throw new Error( "Invalid hash" );
			}

		}
	}
}