const { hashDataObject } = require( "./utils" );
const _ = require( "lodash" );

module.exports = class pow
{
	constructor ()
	{
		this.name = "pow";
		this.difficulty = "000fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
		this.minDifficulty = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
	}
	setValues ( block )
	{
		this.difficulty = block.difficulty || this.difficulty;
	}
	apply ( block, previousBlock )
	{
		let targetDifficulty;
		if ( block.index === 0 )
		{
			block.consensusName = this.name;
			block.consensusDifficulty = this.difficulty;
			block.consensusTotalDifficulty = 0
			targetDifficulty = this.difficulty;
		}
		else
		{
			block.consensusName = previousBlock.consensusName;
			block.consensusDifficulty = previousBlock.consensusDifficulty;
			const num1 = parseInt( this.minDifficulty, 16 ) - parseInt( previousBlock.consensusHash, 16 );
			const num2 = parseInt( previousBlock.consensusTotalDifficulty, 16 );
			const sum = num1 + num2;
			const sumHex = sum.toString( 16 );
			block.consensusTotalDifficulty = sumHex
			targetDifficulty = previousBlock.consensusDifficulty;
		}

		block.consensusNonce = 0;
		let hash = hashDataObject( block )
		while ( hash.localeCompare( targetDifficulty ) != -1 )
		{
			block.consensusNonce++;
			hash = hashDataObject( block );
		}
		block.consensusHash = hash;

		return block
	}
	validate ( block, previousBlock )
	{
		// check if hash is calculated right
		const pureObject = _.omit( block, [ "consensusHash", "hash" ] );
		const hash = hashDataObject( pureObject );
		if ( block.consensusHash.localeCompare( hash ) !== 0 )
		{
			throw new Error( "Invalid hash" );
		}
		if ( block.index !== 0 )
		{
			if ( block.consensusName !== previousBlock.consensusName )
			{
				throw new Error( "Invalid consensus name" );
			}
			if ( block.consensusDifficulty !== previousBlock.consensusDifficulty )
			{
				throw new Error( "Invalid difficulty" );
			}
			if ( block.consensusHash.localeCompare( block.consensusDifficulty ) !== -1 )
			{
				throw new Error( "Invalid hash" );
			}
		}
	}

	chooseBlock ( blocks )
	{
		const self = this
		return _.maxBy( blocks, block =>
		{
			const blockDifficulty = parseInt( self.minDifficulty, 16 ) - parseInt( block.consensusHash, 16 );
			return parseInt( block.consensusTotalDifficulty, 16 ) + blockDifficulty;
		});
	}

	chooseChain ( nodesBlocks )
	{
		const self = this;
		return _.maxBy( nodesBlocks, nodeBlock =>
		{
			const { block } = nodeBlock;
			const blockDifficulty = parseInt( self.minDifficulty, 16 ) - parseInt( block.consensusHash, 16 );
			return parseInt( block.consensusTotalDifficulty, 16 ) + blockDifficulty;
		});
	}

}