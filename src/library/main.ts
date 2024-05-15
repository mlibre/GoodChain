import _ from "lodash";
import { verifyBlock, blockify } from "./block.js";
import ChainStore from "./chain.js";
import Database from "./db-git.js";
import Nodes from "./nodes.js";
import Transaction from "./transactions.js";
import { calculateMiningFee, hashDataObject } from "./utils.js";
import Wallet from "./wallet.js";
import ConsensusClass from "./pow-consensus.js"

export default class Blockchain
{
	private consensus: ConsensusClass;
	private chainName: string;
	private minerKeys: { publicKey: string };
	private db: Database;
	public chain: ChainStore;
	public wallet: Wallet;
	private nodes: Nodes;
	private transactionPool: TransactionData[];
	private transactionPoolSize: number;
	private miningReward: number;

	constructor ({ dbPath, nodes, chainName, minerKeys, consensus }: BlockchainConstructorParams )
	{
		this.consensus = consensus;
		this.chainName = chainName;
		this.minerKeys = minerKeys;
		this.db = new Database( dbPath );
		this.chain = new ChainStore( dbPath );
		this.wallet = new Wallet( dbPath );
		this.nodes = new Nodes( dbPath, nodes );
		this.db.commit( "-1" );
		this.transactionPool = [];
		this.transactionPoolSize = 100;
		this.miningReward = 100;

		if ( this.chain.length === 0 )
		{
			this.mineNewBlock();
		}

		this.consensus.setValues( this.chain.latestBlock );
	}

	mineNewBlock ()
	{
		const self = this;
		try
		{
			self.transactionPool = self.wallet.cleanupTransactions( self.transactionPool );
			self.db.reset();
			const coinbaseTrx = self.genCoinbaseTransaction();
			self.addTransaction( coinbaseTrx );
			const block: BlockData = {
				index: self.chain.length,
				chainName: self.chainName,
				timestamp: Date.now(),
				transactions: self.transactionPool,
				previousHash: self.chain.latestBlock?.hash || "",
				miner: self.minerKeys.publicKey
			};
			self.consensus.apply( block, self.chain.get( block.index - 1 ) );
			block.hash = hashDataObject( block );
			return self.addBlock( block );
		}
		catch ( error )
		{
			self.db.reset();
			self.wallet.reloadDB();
			throw error;
		}
	}

	addBlock ( block: BlockData )
	{
		const newBlock = blockify( block );
		this.verifyCondidateBlock( newBlock );
		this.wallet.performTransactions( newBlock.transactions );
		this.wallet.checkFinalDBState( newBlock );
		this.chain.push( newBlock );
		this.chain.checkFinalDBState( newBlock );
		this.transactionPool = [];
		this.db.commit( newBlock.index );
		return newBlock;
	}

	addBlocks ( blocks: BlockData[] )
	{
		for ( const block of blocks )
		{
			this.addBlock( block );
		}
		return blocks;
	}

	getBlocks ( from: number, to: number )
	{
		return this.chain.getRange( from, to );
	}

	verifyCondidateBlock ( block: BlockData )
	{
		verifyBlock( block, this.chain.latestBlock );
		this.consensus.validate( block, this.chain.latestBlock );
		return true;
	}

	addTransaction ( transaction: TransactionData )
	{
		this.checkTransactionsPoolSize();

		const trx = new Transaction( transaction );

		if ( !trx.isCoinBase() )
		{
			this.wallet.validateAddress( trx.from );
			this.wallet.isTransactionNumberCorrect( trx.from, trx.transaction_number );
		}
		this.wallet.validateAddress( trx.to );

		trx.validate();
		this.isTransactionDuplicate( trx.data );

		this.transactionPool.push( trx.data );
		this.transactionPool.sort( ( a, b ) => { return b.fee - a.fee });
		return this.chain.length;
	}

	addTransactions ( transactions: TransactionData[] )
	{
		const results = [];
		for ( const transaction of transactions )
		{
			try
			{
				results.push({
					id: transaction.id,
					blockNumber: this.addTransaction( transaction )
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
			to: this.minerKeys.publicKey,
			amount: this.miningReward + calculateMiningFee( this.transactionPool ),
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

	isTransactionDuplicate ({ from, to, amount, fee, transaction_number, signature }: TransactionData )
	{
		const duplicate = _.find( this.transactionPool, { from, to, amount, fee, transaction_number, signature });
		if ( duplicate )
		{
			throw new Error( "Duplicate transaction" );
		}
	}

	addNode ( url: string )
	{
		return this.nodes.add( url );
	}

	replaceChain ( newChain: BlockData[] )
	{
		try
		{
			this.chain.replaceBlocks( newChain );
			this.wallet.reCalculateWallet( this.chain.all );
			this.db.commit( this.chain.latestBlock.index );
		}
		catch ( error )
		{
			this.db.reset();
			this.wallet.reloadDB();
			throw error;
		}
		return this.chain.all;
	}
}