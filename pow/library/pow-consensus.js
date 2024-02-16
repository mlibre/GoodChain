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
	apply ( block )
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