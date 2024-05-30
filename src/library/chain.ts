import _ from "lodash";
import * as Block from "./block.js";
import { Level } from "level";

export default class ChainStore
{
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public db: any;
	constructor ( leveldb: Level<string, BlockData> )
	{
		this.db = leveldb.sublevel<string, BlockData>( "chain", { valueEncoding: "json" });
	}

	async length (): Promise<number>
	{
		const lastKey = await this.lastKey();
		return lastKey;
	}

	async lastKey (): Promise<number>
	{
		let lastKey;
		const iterator = this.db.keys({ reverse: true });

		for await ( const key of iterator )
		{
			lastKey = key;
			break;
		}
		if ( !lastKey )
		{
			return 0;
		}
		return Number( lastKey );
	}

	async getAll (): Promise<BlockData[]>
	{
		const result = await this.db.values().all();
		return result;
	}

	async get ( blockNumber: number | string ): Promise<BlockData>
	{
		const blockIndex = parseInt( blockNumber.toString() );
		if ( blockIndex >= await this.length() || blockIndex < 0 )
		{
			throw new Error( "Invalid block number" );
		}
		const block = await this.db.get( blockIndex.toString() );
		return block;
	}

	async getRange ( from: number, to?: number ): Promise<BlockData[]>
	{
		const blocks: BlockData[] = [];
		to = to ?? await this.length() - 1;
		for ( let i = from; i <= to; i++ )
		{
			blocks.push( await this.get( i ) );
		}
		return blocks;
	}

	async genesisBlock (): Promise<BlockData>
	{
		return await this.get( 0 );
	}

	async latestBlock (): Promise<BlockData>
	{
		const lastKey = await this.lastKey();
		const lastBlock = await this.get( lastKey );
		if ( !lastBlock )
		{
			throw new Error( "No blocks found" );
		}
		return lastBlock;
	}

	async push ( block: BlockData ): Promise<void>
	{
		await this.db.put( block.index.toString(), block );
	}

	async replaceChain ( blocks: BlockData[] ): Promise<void>
	{
		await this.db.clear();
		for ( const block of blocks )
		{
			await this.push( block );
		}
	}

	async lastTwoBlocks (): Promise<[BlockData, BlockData]>
	{
		const lastBlock = await this.latestBlock();
		const secondLastBlock = await this.get( lastBlock.index - 1 );
		return [ lastBlock, secondLastBlock ];
	}


	async checkFinalDBState ( proposedBlock: BlockData ): Promise<boolean>
	{
		if ( proposedBlock.index === 0 )
		{
			const lastBlock = await this.latestBlock();
			Block.verifyGenesisBlock( lastBlock );
			if ( !_.isEqual( lastBlock, proposedBlock ) )
			{
				throw new Error( "Invalid chain" );
			}
			return true;
		}
		const [ lastBlock, secondLastBlock ] = [ await this.get( proposedBlock.index ), await this.get( proposedBlock.index - 1 ) ];
		Block.verifyBlock( lastBlock, secondLastBlock );
		if ( !_.isEqual( lastBlock, proposedBlock ) )
		{
			throw new Error( "Invalid chain" );
		}
		const [ lastBlockFile, secondLastBlockFile ] = await this.lastTwoBlocks();
		if ( !_.isEqual( lastBlockFile, lastBlock ) || !_.isEqual( secondLastBlockFile, secondLastBlock ) )
		{
			throw new Error( "Invalid chain" );
		}
		return true;
	}

	async validateChain (): Promise<boolean>
	{
		if ( await this.length() === 0 )
		{
			return true;
		}
		for ( let i = 0; i < await this.length(); i++ )
		{
			if ( i === 0 )
			{
				Block.verifyGenesisBlock( await this.get( i ) );
			}
			else
			{
				Block.verifyBlock( await this.get( i ), await this.get( i - 1 ) );
			}
		}
		return true;
	}
}
