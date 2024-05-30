import { Level } from "level";
import _ from "lodash";
import { blockify, verifyBlock, verifyGenesisBlock } from "./block.js";
import ChainStore from "./chain.js";
import LevelDatabase from "./database.js";
import Nodes from "./nodes.js";
import ConsensusClass from "./pow-consensus.js";
import Transaction from "./transaction.js";
import { calculateMiningFee, computeHash, createFolder } from "./utils.js";
import Wallet from "./wallet.js";

export default class Blockchain
{
	public consensus: ConsensusClass;
	private chainName: string;
	public minerPublicKey: string ;
	public chain: ChainStore;
	public wallet: Wallet;
	public nodes: Nodes;
	public transactionPool: TransactionData[];
	private transactionPoolSize: number;
	database: LevelDatabase;

	constructor ({ dbPath, nodes, chainName, minerPublicKey, consensus }: BlockchainConstructorParams )
	{
		this.consensus = consensus;
		this.chainName = chainName;
		this.minerPublicKey = minerPublicKey;
		createFolder( dbPath );
		const leveldb = new Level<string, BlockData>( dbPath, { valueEncoding: "json" });
		this.database = new LevelDatabase( leveldb );
		this.chain = new ChainStore( leveldb );
		this.wallet = new Wallet( leveldb );
		this.nodes = new Nodes( dbPath, nodes );
		this.transactionPool = [];
		this.transactionPoolSize = 100;
	}

	async init ()
	{
		if ( await this.chain.isEmpty() )
		{
			await this.#mineGenesisBlock();
		}
		this.consensus.setValues( await this.chain.latestBlock() );
	}

	async #mineGenesisBlock ()
	{
		const self = this;
		await self.database.clear();
		const coinbaseTrx = self.genCoinbaseTransaction();
		await self.addTransaction( coinbaseTrx );
		const block: BlockData = {
			index: 0,
			chainName: self.chainName,
			timestamp: Date.now(),
			transactions: self.transactionPool,
			previousHash: "",
			miner: self.minerPublicKey
		};
		self.consensus.applyGenesis( block );
		block.hash = computeHash( block );
		return self.addBlock( block );


	}
	async mineNewBlock ()
	{
		const self = this;
		const blockIndex = await self.chain.length();
		self.transactionPool = await self.wallet.cleanupTransactions( self.transactionPool );
		const coinbaseTrx = self.genCoinbaseTransaction();
		await self.addTransaction( coinbaseTrx );
		const lastBlock = await self.chain.latestBlock();
		const block: BlockData = {
			index: blockIndex + 1,
			chainName: self.chainName,
			timestamp: Date.now(),
			transactions: self.transactionPool,
			previousHash: lastBlock?.hash || "",
			miner: self.minerPublicKey
		};
		self.consensus.apply( block, await self.chain.get( block.index - 1 ) );
		block.hash = computeHash( block );
		return self.addBlock( block );
	}

	async addBlock ( block: BlockData )
	{
		const newBlock = blockify( block );
		this.verifyCandidateBlock( newBlock );
		const actions = await this.wallet.processTrxActionList( newBlock.transactions );
		actions.push( this.chain.pushAction( newBlock ) );
		await this.database.batch( actions );
		this.transactionPool = [];
		return newBlock;
	}

	async addBlocks ( blocks: BlockData[] )
	{
		for ( const block of blocks )
		{
			await this.addBlock( block );
		}
		return blocks;
	}

	async getBlocks ( from: number, to: number )
	{
		return await this.chain.getRange( from, to );
	}

	async verifyCandidateBlock ( block: BlockData )
	{
		if ( block.index == 0 )
		{
			verifyGenesisBlock( block );
			this.consensus.validateGenesis( block );
		}
		else
		{
			verifyBlock( block, await this.chain.latestBlock() );
			this.consensus.validate( block, await this.chain.latestBlock() );
		}
		return true;
	}

	async addTransaction ( transaction: TransactionData ): Promise<number>
	{
		this.checkTransactionsPoolSize();

		const trx = new Transaction( transaction );

		if ( !trx.isCoinBase() && trx.from !== null )
		{
			await this.wallet.validateAddress( trx.from );
			await this.wallet.isTransactionNumberCorrect( trx.from, trx.transaction_number );
		}
		await this.wallet.validateAddress( trx.to );

		trx.validate();
		this.isTransactionDuplicate( trx.data.signature );

		this.transactionPool.push( trx.data );
		this.transactionPool.sort( ( a, b ) =>
		{
			return b.fee - a.fee;
		});
		return await this.chain.length() + 1;
	}

	async addTransactions ( transactions: TransactionData[] )
	{
		const results = [];
		for ( const transaction of transactions )
		{
			try
			{
				results.push({
					id: transaction.id,
					blockNumber: await this.addTransaction( transaction )
				});
			}
			catch ( error )
			{
				results.push({
					id: transaction.id,
					error
				});
			}
		}
		return results;
	}

	genCoinbaseTransaction (): TransactionData
	{
		return {
			from: null,
			to: this.minerPublicKey,
			amount: this.consensus.miningReward + calculateMiningFee( this.transactionPool ),
			fee: 0,
			transaction_number: 0,
			signature: null
		};
	}

	checkTransactionsPoolSize ()
	{
		if ( this.transactionPool.length >= this.transactionPoolSize )
		{
			throw new Error( "Transaction pool is full" );
		}
	}

	isTransactionDuplicate ( signature : string | null | undefined )
	{
		const duplicate = _.find( this.transactionPool, { signature });
		if ( duplicate )
		{
			throw new Error( "Duplicate transaction" );
		}
	}

	async replaceChain ( newChain: BlockData[] )
	{
		await this.database.clear();
		const actions: PutAction[] = [];
		for ( const block of newChain )
		{
			const putAction = await this.chain.pushAction( block );
			actions.push( putAction );
			actions.push( ...await this.wallet.processTrxActionList( block.transactions ) );
			this.database.batch( actions );
		}
		return this.chain.getAll();
	}

	addNode ( url: string )
	{
		return this.nodes.add( url );
	}
}