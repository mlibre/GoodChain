const { initJsonFile, updateFile, calculateMiningFee, proccessTransaction } = require( "./utils" )
const Wallet = require( "./wallet" )
const transaction = require( "./transactions" )
const Block = require( "./block" )

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
		self.addCoinbaseTransaction();
		this.transactionPool = proccessTransaction( this.transactionPool, this.wallet );
		const block = new Block({
			index: self.chainLength,
			chainName: self.chainName,
			transactions: self.transactionPool,
			previousHash: self.latestBlock?.hash,
			miner: this.minerKeys.publicKey,
			difficulty: self.difficulty
		});
		block.mine();
		self.addBlock( block );
		Block.verify( block, self.previousBlock )
		self.transactionPool = [];
		updateFile( self.filePath, self.chain );
		updateFile( self.wallet.filePath, self.wallet.wallets );
		return block;
	}

	addTransaction ({	from,	to, amount, fee, transaction_number, signature })
	{
		this.wallet.validateAddress( from );
		this.wallet.validateAddress( to );

		transaction.validate({	from,	to, amount, fee, transaction_number, signature }, this.wallet );
		transaction.checkPoolSize( this.transactionPool, this.transactionPoolSize );

		this.transactionPool.push({ from,	to, amount, fee, transaction_number, signature });
		this.transactionPool.sort( ( a, b ) => { return b.fee - a.fee });
		return this.chainLength
	}

	addCoinbaseTransaction ( )
	{
		const trx = {
			from: null,
			to: this.minerKeys.publicKey,
			amount: this.miningReward + calculateMiningFee( this.transactionPool ),
			fee: 0,
			transaction_number: 0,
			signature: null
		};
		this.transactionPool.push( trx );
		return trx;
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

	get latestBlock ()
	{
		return this.chain[this.chain.length - 1]
	}

	get previousBlock ()
	{
		return this.chain[this.chain.length - 2]
	}

	get chainLength ()
	{
		return this.chain.length
	}

	getBlock ( blockNumber )
	{
		return this.chain[blockNumber]
	}

	addBlock ( block )
	{
		this.chain.push( block )
	}

	isChainEmpty ()
	{
		return this.chain.length === 0
	}
}

module.exports = Blockchain
