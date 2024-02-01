const Blockchain = require( "../library/chain" );
const Wallet = require( "../library/wallet" );
const transactions = require( "../library/transactions" )
const { deleteDb } = require( "../library/utils" )
deleteDb( "./db/blockchain.json" );
deleteDb( "./db/wallets.json" );

const userKeys = Wallet.createKeyPair();
const minerKeys = Wallet.createKeyPair();
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
trx.signature = transactions.sign( minerKeys.privateKey, trx );

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
trx2.signature = transactions.sign( userKeys.privateKey, trx2 );
blockchain.addTransaction( trx2 );

blockchain.mineNewBlock();
console.log( blockchain.validateChain() );
console.log( "Latest Block :", blockchain.latestBlock );
console.log( "Wallets : ", blockchain.wallet );
