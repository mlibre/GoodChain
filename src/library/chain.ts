import * as fs from "fs";
import * as _ from "lodash";
import * as path from "path";
import { verify as blackVerify } from "./block.js";
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

	get all (): any[]
	{
		const fileNames = fs.readdirSync( this.folderPath ).sort();
		const blocks: any[] = [];
		for ( const fileName of fileNames )
		{
			const filePath = path.join( this.folderPath, fileName );
			const block = JSON.parse( fs.readFileSync( filePath, "utf8" ) );
			blocks.push( block );
		}
		return blocks;
	}

	get ( blockNumber: number ): any | null
	{
		if ( blockNumber === -1 )
		{
			return null;
		}
		return JSON.parse( fs.readFileSync( `${this.blockFilePath( blockNumber )}.json`, "utf8" ) );
	}

	getRange ( from: number, to?: number ): any[]
	{
		const blocks: any[] = [];
		to = to || this.length - 1;
		for ( let i = from; i <= to; i++ )
		{
			blocks.push( this.get( i ) );
		}
		return blocks;
	}

	get genesisBlock (): any
	{
		return this.get( 0 );
	}

	get latestBlock (): any | null
	{
		const files = fs.readdirSync( this.folderPath );
		if ( files.length === 0 )
		{
			return null;
		}
		const lastFile = files.sort().pop();
		return JSON.parse( fs.readFileSync( this.blockFilePath( lastFile! ), "utf8" ) );
	}

	push ( block: any ): void
	{
		fs.writeFileSync( `${this.blockFilePath( block.index )}.json`, JSON.stringify( block, null, "\t" ) );
	}

	replaceBlocks ( blocks: any[] ): void
	{
		for ( const block of blocks )
		{
			this.push( block );
		}
	}

	lastTwoBlocks (): [any, any]
	{
		const lastBlock = this.latestBlock;
		const secondLastBlock = this.get( lastBlock!.index - 1 );
		return [ lastBlock, secondLastBlock ];
	}

	blockFilePath ( index: number | string ): string
	{
		return path.join( this.folderPath, index.toString() );
	}

	checkFinalDBState ( proposedBlock: any ): boolean
	{
		if ( proposedBlock.index === 0 )
		{
			const lastBlock = this.latestBlock;
			blackVerify( lastBlock, null );
			if ( !_.isEqual( lastBlock, proposedBlock ) )
			{
				throw new Error( "Invalid chain" );
			}
			return true;
		}
		const [ lastBlock, secondLastBlock ] = [ this.get( proposedBlock.index ), this.get( proposedBlock.index - 1 ) ];
		blackVerify( lastBlock, secondLastBlock );
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

	validateChain (): boolean
	{
		if ( this.length === 0 )
		{
			return true;
		}
		for ( let i = 0; i < this.length; i++ )
		{
			blackVerify( this.get( i ), this.get( i - 1 ) );
		}
		return true;
	}
}
