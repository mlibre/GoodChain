import { Level } from "level";
import * as Block from "./block.js";

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
		return await this.getLatestBlockIndex();
	}

	async getLatestBlockIndex (): Promise<number>
	{
		let getLatestBlockIndex;
		const iterator = this.db.keys({ reverse: true });

		for await ( const key of iterator )
		{
			getLatestBlockIndex = key;
			break;
		}
		if ( !getLatestBlockIndex )
		{
			throw new Error( "No blocks found" );
		}
		return Number( getLatestBlockIndex );
	}

	async getAll (): Promise<BlockData[]>
	{
		const result = await this.db.values().all();
		return result;
	}

	async get ( blockNumber: number | string ): Promise<BlockData>
	{
		const blockIndex = parseInt( blockNumber.toString() );
		if ( blockIndex > await this.length() || blockIndex < 0 )
		{
			throw new Error( "Invalid block number" );
		}
		const block = await this.db.get( blockIndex.toString() );
		return block;
	}

	async getRange ( from: number, to?: number ): Promise<BlockData[]>
	{
		const blocks: BlockData[] = [];
		to = to || await this.length();
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
		const getLatestBlockIndex = await this.getLatestBlockIndex();
		const lastBlock = await this.get( getLatestBlockIndex );
		if ( !lastBlock )
		{
			throw new Error( "No blocks found" );
		}
		return lastBlock;
	}

	createPutAction ( block: BlockData ): PutAction
	{
		const action: PutAction = {
			type: "put",
			sublevel: this.db,
			key: block.index.toString(),
			value: block
		};
		return action;
	}

	async lastTwoBlocks (): Promise<[BlockData, BlockData]>
	{
		const lastBlock = await this.latestBlock();
		const secondLastBlock = await this.get( lastBlock.index - 1 );
		return [ lastBlock, secondLastBlock ];
	}

	async validateChain (): Promise<boolean>
	{
		for ( let i = 0; i <= await this.length(); i++ )
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

	async isEmpty (): Promise<boolean>
	{
		try
		{
			await this.getLatestBlockIndex();
			return false;
		}
		catch ( error: unknown )
		{
			if ( error instanceof Error && error.message === "No blocks found" )
			{
				return true;
			}
			throw error;
		}
	}
}
