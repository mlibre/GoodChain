const Block = require( "./block" )
const fs = require( "fs" );
const path = require( "path" );
const _ = require( "lodash" );
const { createFolder } = require( "./utils" );

class ChainStore
{
	constructor ( folderPath )
	{
		this.folderPath = folderPath;
		createFolder( folderPath );
	}

	push ( block )
	{
		fs.writeFileSync( `${this.blockFilePath( block.index )}.json`, JSON.stringify( block, null, "\t" ) );
	}

	get length ()
	{
		return fs.readdirSync( this.folderPath ).length;
	}

	checkDB ( proposedBlock )
	{
		if ( proposedBlock.index === 0 )
		{
			const lastBlock = this.lastBlock();
			Block.verify( lastBlock, null );
			if ( !_.isEqual( lastBlock, proposedBlock ) )
			{
				throw new Error( "Invalid chain" );
			}
			return true
		}
		const [ lastBlock, secondLastBlock ] = [ this.get( proposedBlock.index - 1 ), this.get( proposedBlock.index - 2 ) ];
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

	get ( blockNumber )
	{
		return JSON.parse( fs.readFileSync( `${this.blockFilePath( blockNumber ) }.json` ) );
	}

	lastBlock ()
	{
		const files = fs.readdirSync( this.folderPath );
		const lastFile = files.sort().pop();
		return JSON.parse( fs.readFileSync( this.blockFilePath( lastFile ) ) );
	}
	lastTwoBlocks ()
	{
		const files = fs.readdirSync( this.folderPath );
		const lastFile = files.sort().pop();
		const lastBlock = JSON.parse( fs.readFileSync( this.blockFilePath( lastFile ) ) );
		const secondLastBlock = JSON.parse( fs.readFileSync( this.blockFilePath( lastBlock.index - 1 ) ) );
		return [ lastBlock, secondLastBlock ];
	}

	blockFilePath ( index )
	{
		return path.join( this.folderPath, index.toString() );
	}
}


module.exports = ChainStore