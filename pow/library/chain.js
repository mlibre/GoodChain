const { initJsonFile, updateFile, calculateMiningFee, uuid } = require( "./utils" )
const Wallet = require( "./wallet" )
const Block = require( "./block" )
const trxLib = require( "./transactions" )

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
		this.transactionPool = trxLib.proccessTransactions( this.transactionPool, this.wallet );
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

	addTransaction ({	from,	to, amount, fee, transaction_number, signature })
	{
		this.wallet.validateAddress( from );
		this.wallet.validateAddress( to );

		trxLib.validate({	from,	to, amount, fee, transaction_number, signature }, this.wallet );
		this.checkPoolSize( );
		trxLib.isDuplicate( this.transactionPool, {	from,	to, amount, fee, transaction_number, signature });

		this.transactionPool.push({ from, to, amount, fee, transaction_number, signature, id: uuid() });
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

	checkPoolSize ( )
	{
		if ( this.transactionPool.length >= this.transactionPoolSize )
		{
			throw new Error( "Transaction pool is full" );
		}
	}

	get latestBlock ()
	{
		return this.chain[this.chain.length - 1]
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

	verifyAndAddBlock ( block )
	{
		Block.verify( block, this.latestBlock )
		this.addBlock( block )
		updateFile( this.filePath, this.chain )
		return block
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
