const { hashDataObject } = require( "./utils" );

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
		block.nonce = 0;
		block.hash = hashDataObject( block );
		while ( block.hash.localeCompare( this.difficulty ) != -1 )
		{
			block.nonce++;
			block.hash = hashDataObject( block );
		}
		if ( block.index === 0 )
		{
			block.totalDifficulty = block.consensusDifficulty
		}
		else
		{
			const num1 = parseInt( block.consensusDifficulty, 16 );
			const num2 = parseInt( previousBlock.consensusDifficulty, 16 );
			const sum = num1 + num2;
			const sumHex = sum.toString( 16 );
			block.totalDifficulty = sumHex
		}
		return block.nonce
	}
	validate ( block )
	{
		if ( block.consensusName !== this.name )
		{
			throw new Error( "Invalid consensus name" );
		}
		if ( block.consensusDifficulty !== this.difficulty )
		{
			throw new Error( "Invalid difficulty" );
		}
	}
}