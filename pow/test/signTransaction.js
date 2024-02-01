const Wallet = require( "../library/wallet" );
const transactions = require( "../library/transactions" )
const { initJsonFile } = require( "../library/utils" )

const minerKeys = initJsonFile( "./keys/miner.json", Wallet.createKeyPair() );
const userKeys = initJsonFile( "./keys/user.json", Wallet.createKeyPair() );

const trx =
{
	from: minerKeys.publicKey,
	to: userKeys.publicKey,
	amount: 50,
	fee: 0,
	transaction_number: 1
}
trx.signature = transactions.sign( minerKeys.privateKey, trx );
console.log( trx );