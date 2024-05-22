import fs from "fs";
import _ from "lodash";
import path from "path";
import * as Block from "./block.js";
import { createFolder, makeFilePath } from "./utils.js";

export default class ChainStore
{
	folderPath: string;

	constructor ( folderPath: string )
	{
		this.folderPath = makeFilePath( folderPath, "chain" );
		createFolder( this.folderPath );
	}

	get length (): number
	{
		return fs.readdirSync( this.folderPath ).length;
	}

	get all (): BlockData[]
	{
		const fileNames = fs.readdirSync( this.folderPath ).sort();
		const blocks: BlockData[] = [];
		for ( const fileName of fileNames )
		{
			const filePath = path.join( this.folderPath, fileName );
			const block = JSON.parse( fs.readFileSync( filePath, "utf8" ) );
			blocks.push( block );
		}
		return blocks;
	}

	get ( blockNumber: number | string ): BlockData
	{
		const blockIndex = parseInt( blockNumber.toString() );
		if ( blockIndex >= this.length || blockIndex < 0 )
		{
			throw new Error( "Invalid block number" );
		}
		return JSON.parse( fs.readFileSync( `${this.blockFilePath( blockNumber )}.json`, "utf8" ) );
	}

	getRange ( from: number, to?: number ): BlockData[]
	{
		const blocks: BlockData[] = [];
		to = to ?? this.length - 1;
		for ( let i = from; i <= to; i++ )
		{
			blocks.push( this.get( i ) );
		}
		return blocks;
	}

	get genesisBlock (): BlockData
	{
		return this.get( 0 );
	}

	get latestBlock (): BlockData
	{
		const files = fs.readdirSync( this.folderPath );
		const lastFile = files.sort().pop();
		if ( !lastFile )
		{
			throw new Error( "No blocks found" );
		}
		return JSON.parse( fs.readFileSync( this.blockFilePath( lastFile ), "utf8" ) );
	}

	push ( block: BlockData ): void
	{
		fs.writeFileSync( `${this.blockFilePath( block.index )}.json`, JSON.stringify( block, null, "\t" ) );
	}

	replaceBlocks ( blocks: BlockData[] ): void
	{
		for ( const block of blocks )
		{
			this.push( block );
		}
	}

	lastTwoBlocks (): [BlockData, BlockData]
	{
		const lastBlock = this.latestBlock;
		const secondLastBlock = this.get( lastBlock.index - 1 );
		return [ lastBlock, secondLastBlock ];
	}

	blockFilePath ( index: number | string ): string
	{
		return path.join( this.folderPath, index.toString() );
	}

	checkFinalDBState ( proposedBlock: BlockData ): boolean
	{
		if ( proposedBlock.index === 0 )
		{
			const lastBlock = this.latestBlock;
			Block.verifyGenesisBlock( lastBlock );
			if ( !_.isEqual( lastBlock, proposedBlock ) )
			{
				throw new Error( "Invalid chain" );
			}
			return true;
		}
		const [ lastBlock, secondLastBlock ] = [ this.get( proposedBlock.index ), this.get( proposedBlock.index - 1 ) ];
		Block.verifyBlock( lastBlock, secondLastBlock );
		if ( !_.isEqual( lastBlock, proposedBlock ) )
		{
			throw new Error( "Invalid chain" );
		}
		const [ lastBlockFile, secondLastBlockFile ] = this.lastTwoBlocks();
		if ( !_.isEqual( lastBlockFile, lastBlock ) || !_.isEqual( secondLastBlockFile, secondLastBlock ) )
		{
			throw new Error( "Invalid chain" );
		}
		return true;
	}

	validateChain (): boolean
	{
		if ( this.length === 0 )
		{
			return true;
		}
		for ( let i = 0; i < this.length; i++ )
		{
			if ( i === 0 )
			{
				Block.verifyGenesisBlock( this.get( i ) );
			}
			else
			{
				Block.verifyBlock( this.get( i ), this.get( i - 1 ) );
			}
		}
		return true;
	}
}
