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
		// this.nonce = 0;
		// this.hash = hashDataObject( this.data );
		// while ( this.hash.localeCompare( this.consensusDifficulty ) != -1 )
		// {
		// 	this.nonce++;
		// 	this.hash = hashDataObject( this.data );
		// }
		// return this.nonce
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