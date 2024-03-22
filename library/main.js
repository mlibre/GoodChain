const _ = require( "lodash" );
const { updateFile, calculateMiningFee, objectify, hashDataObject } = require( "./utils" )
const Database = require( "./db-git" )
const ChainStore = require( "./chain" )
const Wallet = require( "./wallet" )
const Block = require( "./block" )
const Transaction = require( "./transactions" )
const Nodes = require( "./nodes" )

class Blockchain
{
	constructor ({ dbFolderPath, nodes, chainName, minerKeys, consensus })
	{
		this.consensus = consensus;
		this.chainName = chainName;
		this.minerKeys = minerKeys;
		this.db = new Database( dbFolderPath );
		this.chain = new ChainStore( dbFolderPath );
		this.wallet = new Wallet( dbFolderPath );
		this.nodes = new Nodes( dbFolderPath, nodes );
		this.db.commit( "-1" )
		this.transactionPool = [];
		this.transactionPoolSize = 100;
		this.miningReward = 100;

		if ( this.chain.length === 0 )
		{
			this.mineNewBlock()
		}

		this.consensus.setValues( this.chain.latestBlock );

		// check whole block chain itegrity and validitty
	}

	mineNewBlock ()
	{
		const self = this
		try
		{
			self.transactionPool = self.wallet.cleanupTransactions( self.transactionPool );
			self.db.reset()
			const coinbaseTrx = self.genCoinbaseTransaction();
			self.addTransaction( coinbaseTrx )
			const block = {
				index: self.chain.length,
				chainName: self.chainName,
				timestamp: Date.now(),
				transactions: self.transactionPool,
				previousHash: self.chain.latestBlock?.hash || "",
				miner: self.minerKeys.publicKey
			};
			this.consensus.apply( block, self.chain.get( block.index - 1 ) );
			block.hash = hashDataObject( block );
			self.addBlock( block );
			return block;
		}
		catch ( error )
		{
			self.db.reset()
			self.wallet.reloadDB()
			throw error
		}
	}

	addBlock ( block )
	{
		const newBlock = objectify( block );
		this.verifyCondidateBlock( newBlock );
		this.wallet.performTransactions( newBlock.transactions );
		this.wallet.checkDB( newBlock )
		this.chain.push( newBlock )
		this.chain.checkDB( newBlock )
		this.transactionPool = [];
		this.db.commit( newBlock.index )
		return newBlock
	}

	verifyCondidateBlock ( block )
	{
		Block.verify( block, this.chain.latestBlock )
		this.consensus.validate( block, this.chain.latestBlock );
		return true
	}

	genCoinbaseTransaction ( )
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

	addTransaction ( transaction )
	{
		this.checkTransactionsPoolSize( );

		const trx = new Transaction( transaction );
		this.wallet.validateAddress( trx.from );
		this.wallet.validateAddress( trx.to );

		trx.validate( );
		this.isTransactionDuplicate( trx.data );

		this.transactionPool.push( trx.data );
		this.transactionPool.sort( ( a, b ) => { return b.fee - a.fee });
		return this.chain.length
	}

	addTransactions ( transactions )
	{
		const results = []
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

	checkTransactionsPoolSize ( )
	{
		if ( this.transactionPool.length >= this.transactionPoolSize )
		{
			throw new Error( "Transaction pool is full" );
		}
	}

	isTransactionDuplicate ({ from, to, amount, fee, transaction_number, signature })
	{
		const duplicate = _.find( this.transactionPool, { from, to, amount, fee, transaction_number, signature });
		if ( duplicate )
		{
			throw new Error( "Duplicate transaction" );
		}
	}

	replaceChain ( newChain )
	{
		this.chain = newChain;
		updateFile( this.filePath, this.chain )
		this.wallet.reCalculateWallet( this.chain )
		return newChain
	}

	addBlocks ( blocks )
	{
		for ( const block of blocks )
		{
			this.addBlock( block )
		}
		return blocks
	}

	getBlock ( blockNumber )
	{
		if ( blockNumber >= this.chain.length )
		{
			throw new Error( "Block number is greater than chain length" );
		}
		return this.chain[blockNumber]
	}

	getBlocks ( from, to )
	{
		return this.chain.slice( from, to )
	}

	validateChain ()
	{
		if ( this.chain.length === 0 )
		{
			return true;
		}
		for ( let i = 0; i < this.chain.length; i++ )
		{
			Block.verify( this.chain.get( i ), this.chain.get( i - 1 ) )
		}
		return true
	}
}

module.exports = Blockchain
