const { sign } = require( "../library/transactions" )
const { initJsonFile, createKeyPair } = require( "../library/utils" )

const minerKeys = initJsonFile( "./keys/miner.json", createKeyPair() );
const userKeys = initJsonFile( "./keys/user.json", createKeyPair() );

const trx =
{
	from: minerKeys.publicKey,
	to: userKeys.publicKey,
	amount: 50,
	fee: 0,
	transaction_number: 1
}
trx.signature = sign( trx, minerKeys.privateKey );
console.log( JSON.stringify( trx ) );