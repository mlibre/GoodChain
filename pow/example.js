const Blockchain = require( "./library/chain" );
const Wallet = require( "./library/wallet" );
const transactions = require( "./library/transactions" )
const { deleteDbFile } = require( "./library/utils" )
deleteDbFile( "./db/blockchain.json" );
deleteDbFile( "./db/wallets.json" );

const userKeysPairs = Wallet.createKeyPair();
const minerKeyPairs = Wallet.createKeyPair();
const blockchain = new Blockchain( "./db/blockchain.json", "./db/wallets.json", minerKeyPairs );
blockchain.mineNewBlock( minerKeyPairs );

const trx =
{
	from: minerKeyPairs.publicKey,
	to: userKeysPairs.publicKey,
	amount: 50,
	fee: 0,
	transaction_number: 1
}
trx.signature = transactions.sign( minerKeyPairs.privateKey, trx );

const blockNumber = blockchain.addTransaction( trx );
blockchain.mineNewBlock( minerKeyPairs );
console.log( "Mined block :", blockNumber, blockchain.latestBlock );

const trx2 = {
	from: userKeysPairs.publicKey,
	to: "user3",
	amount: 5,
	fee: 0.3,
	transaction_number: 2
}
trx2.signature = transactions.sign( userKeysPairs.privateKey, trx2 );
blockchain.addTransaction( trx2 );

blockchain.mineNewBlock( minerKeyPairs );
console.log( blockchain.validateChain() );
console.log( "Latest Block :", blockchain.latestBlock );
console.log( "Wallets : ", blockchain.wallet );
