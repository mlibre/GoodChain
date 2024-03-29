const fs = require( "fs" );
const path = require( "path" );
const _ = require( "lodash" );
const Block = require( "./block" )
const { createFolder, makeFilePath } = require( "./utils" );

class ChainStore
{
	constructor ( folderPath )
	{
		this.folderPath = makeFilePath( folderPath, "chain" );
		createFolder( this.folderPath );
	}

	push ( block )
	{
		fs.writeFileSync( `${this.blockFilePath( block.index )}.json`, JSON.stringify( block, null, "\t" ) );
	}

	get length ()
	{
		return fs.readdirSync( this.folderPath ).length;
	}

	get ( blockNumber )
	{
		if ( blockNumber == -1 )
		{
			return null
		}
		return JSON.parse( fs.readFileSync( `${this.blockFilePath( blockNumber ) }.json` ) );
	}

	get genesisBlock ()
	{
		return this.get( 0 );
	}

	get latestBlock ()
	{
		const files = fs.readdirSync( this.folderPath );
		if ( files.length === 0 )
		{
			return null
		}
		const lastFile = files.sort().pop();
		return JSON.parse( fs.readFileSync( this.blockFilePath( lastFile ) ) );
	}

	lastTwoBlocks ()
	{
		const lastBlock = this.latestBlock
		const secondLastBlock = this.get( lastBlock.index - 1 )
		return [ lastBlock, secondLastBlock ];
	}

	blockFilePath ( index )
	{
		return path.join( this.folderPath, index.toString() );
	}

	checkFinalDBState ( proposedBlock )
	{
		if ( proposedBlock.index === 0 )
		{
			const lastBlock = this.latestBlock;
			Block.verify( lastBlock, null );
			if ( !_.isEqual( lastBlock, proposedBlock ) )
			{
				throw new Error( "Invalid chain" );
			}
			return true
		}
		const [ lastBlock, secondLastBlock ] = [ this.get( proposedBlock.index ), this.get( proposedBlock.index - 1 ) ];
		Block.verify( lastBlock, secondLastBlock )
		if ( !_.isEqual( lastBlock, proposedBlock ) )
		{
			throw new Error( "Invalid chain" );
		}
		const [ lastBlockFile, secondLastBlockFile ] = this.lastTwoBlocks();
		if ( !_.isEqual( lastBlockFile, lastBlock ) || !_.isEqual( secondLastBlockFile, secondLastBlock ) )
		{
			throw new Error( "Invalid chain" );
		}
		return lastBlock;
	}

	validateChain ()
	{
		if ( this.length === 0 )
		{
			return true;
		}
		for ( let i = 0; i < this.length; i++ )
		{
			Block.verify( this.get( i ), this.get( i - 1 ) )
		}
		return true
	}
}


module.exports = ChainStore