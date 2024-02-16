const _ = require( "lodash" );
const { initJsonFile, updateFile, calculateMiningFee, objectify } = require( "./utils" )
const Wallet = require( "./wallet" )
const Block = require( "./block" )
const Transaction = require( "./transactions" )

class Blockchain
{
	constructor ({ chainFilePath, walletFilePath, chainName, minerKeys, consensus })
	{
		this.consensus = consensus;
		this.chainName = chainName;
		this.minerKeys = minerKeys;
		this.filePath = chainFilePath;
		this.chain = initJsonFile( chainFilePath, [] );
		this.wallet = new Wallet( walletFilePath );
		this.transactionPool = [];
		this.transactionPoolSize = 100;
		this.miningReward = 100;

		if ( this.chain.length === 0 )
		{
			this.mineNewBlock()
		}

		this.consensus.setValues( this.latestBlock );
	}

	mineNewBlock ()
	{
		const self = this
		self.cleanupTransactionPool()
		const coinbaseTrx = self.genCoinbaseTransaction();
		self.addTransaction( coinbaseTrx )
		const block = new Block({
			index: self.chainLength,
			chainName: self.chainName,
			transactions: self.transactionPool,
			previousHash: self.latestBlock?.hash,
			miner: self.minerKeys.publicKey
		});
		this.consensus.apply( block, self.getBlock( block.index - 1 ) );
		block.hashIt();
		self.addBlock( block );
		return block;
	}

	addBlock ( block )
	{
		const newBlock = objectify( block );
		Block.verify( newBlock, this.latestBlock )
		this.simulateTransactions( newBlock.transactions )
		this.performTransactions( newBlock.transactions );
		this.chain.push( newBlock )
		this.transactionPool = [];
		updateFile( this.filePath, this.chain )
		return newBlock
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
		const trx = new Transaction( transaction );
		this.wallet.validateAddress( trx.from );
		this.wallet.validateAddress( trx.to );

		trx.validate( );
		this.checkTransactionsPoolSize( );
		this.isTransactionDuplicate( trx.data );

		this.transactionPool.push( trx.data );
		this.transactionPool.sort( ( a, b ) => { return b.fee - a.fee });
		return this.chainLength
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

	simulateTransactions ( transactions )
	{
		const clonedWallet = new Wallet( null, this.wallet.list );
		for ( const tmpTrx of transactions )
		{
			const trx = new Transaction( tmpTrx );
			if ( trx.isCoinBase( ) )
			{
				clonedWallet.addBalance( trx.to, trx.amount );
				continue
			}
			if ( trx.transaction_number <= clonedWallet.transactionNumber( trx.from ) )
			{
				throw new Error( "Transaction number is less than wallet transaction number" );
			}
			clonedWallet.minusBalance( trx.from, trx.amount + trx.fee );
			clonedWallet.incrementTN( trx.from );
			clonedWallet.addBalance( trx.to, trx.amount );
		}
	}

	performTransactions ( transactionList )
	{
		for ( const tmpTrx of transactionList )
		{
			const trx = new Transaction( tmpTrx );
			if ( trx.isCoinBase( ) )
			{
				this.wallet.addBalance( trx.to, trx.amount );
				continue
			}
			this.wallet.minusBalance( trx.from, trx.amount + trx.fee );
			this.wallet.incrementTN( trx.from );
			this.wallet.addBalance( trx.to, trx.amount );
		}
		updateFile( this.wallet.filePath, this.wallet.wallets );
		return transactionList;
	}

	cleanupTransactionPool ( )
	{
		const clonedWallet = new Wallet( null, this.wallet.list );
		const newTransactionPool = []
		for ( const tmpTrx of this.transactionPool )
		{
			try
			{
				const trx = new Transaction( tmpTrx );
				if ( trx.isCoinBase( ) )
				{
					console.log( "Dropping coinbase transaction" );
					continue
				}
				if ( trx.transaction_number <= clonedWallet.transactionNumber( trx.from ) )
				{
					console.log( "Dropping transaction with transaction number less than wallet transaction number" );
					continue
				}
				clonedWallet.minusBalance( trx.from, trx.amount + trx.fee );
				clonedWallet.incrementTN( trx.from );
				clonedWallet.addBalance( trx.to, trx.amount );
				newTransactionPool.push( trx.data );
			}
			catch ( error )
			{
				console.log( error );
			}
		}
		this.transactionPool = newTransactionPool;
		return newTransactionPool
	}

	addBlocks ( blocks )
	{
		for ( const block of blocks )
		{
			this.addBlock( block )
		}
		return blocks
	}

	// replaceBlock ( block )
	// {
	// 	const newBlock = new Block( block );
	// 	Block.verify( newBlock, this.getBlock( newBlock.index - 1 ) )
	// 	// re calcuate wallet
	// 	this.simulateTransactions( newBlock.transactions )
	// 	this.performTransactions( newBlock.transactions );
	// 	this.chain[newBlock.index] = newBlock.all
	// 	this.chain = this.chain.slice( 0, newBlock.index + 1 )
	// 	updateFile( this.filePath, this.chain )
	// 	return newBlock
	// }

	getBlock ( blockNumber )
	{
		if ( blockNumber >= this.chainLength )
		{
			throw new Error( "Block number is greater than chain length" );
		}
		return this.chain[blockNumber]
	}

	getBlocks ( from, to )
	{
		return this.chain.slice( from, to )
	}

	get latestBlock ()
	{
		return this.chain[this.chain.length - 1]
	}

	get chainLength ()
	{
		return this.chain.length
	}

	validateChain ()
	{
		if ( this.chainLength === 0 )
		{
			return true;
		}
		for ( let i = 0; i < this.chainLength; i++ )
		{
			Block.verify( this.getBlock( i ), this.getBlock( i - 1 ) )
		}
		return true
	}
}

module.exports = Blockchain
