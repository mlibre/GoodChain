const Blockchain = require( "../library/chain" );
const { sign } = require( "../library/transactions" )
const { deleteFile, initJsonFile, createKeyPair } = require( "../library/utils" )
deleteFile( "./db/blockchain.json" );
deleteFile( "./db/wallets.json" );
deleteFile( "./keys/miner.json" );
deleteFile( "./keys/user.json" );

const userKeys = initJsonFile( "./keys/user.json", createKeyPair() );
const minerKeys = initJsonFile( "./keys/miner.json", createKeyPair() );
const blockchain = new Blockchain( "./db/blockchain.json", "./db/wallets.json", "GoodChain", minerKeys );
blockchain.mineNewBlock();

const trx =
{
	from: minerKeys.publicKey,
	to: userKeys.publicKey,
	amount: 50,
	fee: 0,
	transaction_number: 1
}
trx.signature = sign( trx, minerKeys.privateKey );

const blockNumber = blockchain.addTransaction( trx );
blockchain.mineNewBlock();
console.log( "Mined block :", blockNumber, blockchain.latestBlock );

const trx2 = {
	from: userKeys.publicKey,
	to: "user3",
	amount: 5,
	fee: 0.3,
	transaction_number: 2
}
trx2.signature = sign( trx2, userKeys.privateKey );
blockchain.addTransaction( trx2 );

blockchain.mineNewBlock();
console.log( blockchain.validateChain() );
console.log( "Latest Block :", blockchain.latestBlock );
console.log( "Wallets : ", blockchain.wallet );
