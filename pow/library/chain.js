const _ = require( "lodash" );
const { initJsonFile, updateFile, calculateMiningFee } = require( "./utils" )
const Wallet = require( "./wallet" )
const Block = require( "./block" )
const Transaction = require( "./transactions" )

class Blockchain
{
	constructor ( chainFilePath, walletFilePath, chainName, minerKeys )
	{
		this.chainName = chainName;
		this.minerKeys = minerKeys;
		this.filePath = chainFilePath;
		this.chain = initJsonFile( chainFilePath, [] );
		this.wallet = new Wallet( walletFilePath );
		this.transactionPool = [];
		this.transactionPoolSize = 100;
		this.difficulty = "000fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
		this.miningReward = 100;

		if ( this.isChainEmpty() )
		{
			this.mineNewBlock()
		}
	}

	mineNewBlock ()
	{
		const self = this
		const coinbaseTrx = self.genCoinbaseTransaction();
		self.addTransaction( coinbaseTrx )
		this.transactionPool = self.proccessTransactions( );
		const block = new Block({
			index: self.chainLength,
			chainName: self.chainName,
			transactions: self.transactionPool,
			previousHash: self.latestBlock?.hash,
			miner: this.minerKeys.publicKey,
			difficulty: self.difficulty
		});
		block.mine();
		self.verifyAndAddBlock( block );
		self.transactionPool = [];
		updateFile( self.wallet.filePath, self.wallet.wallets );
		return block;
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

	proccessTransactions = function ( )
	{
		const processedTransactions = [];
		for ( const tmpTrx of this.transactionPool )
		{
			const trx = new Transaction( tmpTrx );
			if ( trx.isCoinBase( ) )
			{
				this.wallet.addBalance( trx.to, trx.amount );
				processedTransactions.push( trx.data );
				continue
			}
			if ( trx.transaction_number < this.wallet.transactionNumber( trx.from ) )
			{
				continue
			}
			if ( this.wallet.hasEnoughBalance( trx.from, trx.amount + trx.fee ) )
			{
				this.wallet.minusBalance( trx.from, trx.amount + trx.fee );
				this.wallet.incrementTN( trx.from );
				this.wallet.addBalance( trx.to, trx.amount );
				processedTransactions.push( trx.data );
			}
		}
		return processedTransactions;
	}

	verifyAndAddBlock ( block )
	{
		Block.verify( block, this.latestBlock )
		this.addBlock( block )
		updateFile( this.filePath, this.chain )
		return block
	}

	addBlock ( block )
	{
		this.chain.push( block )
	}

	getBlock ( blockNumber )
	{
		return this.chain[blockNumber]
	}

	get latestBlock ()
	{
		return this.chain[this.chain.length - 1]
	}

	get chainLength ()
	{
		return this.chain.length
	}

	isChainEmpty ()
	{
		return this.chain.length === 0
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
