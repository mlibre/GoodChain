import Transaction from "../library/transactions.js";
import { initJsonFile, createKeyPair } from "../library/utils.js";

const minerKeys = initJsonFile( "./keys/miner.json", createKeyPair() );
const userKeys = initJsonFile( "./keys/user.json", createKeyPair() );

const trx = new Transaction({
	from: minerKeys.publicKey,
	to: userKeys.publicKey,
	amount: 50,
	fee: 0,
	transaction_number: 1,
});
trx.signature = trx.sign( minerKeys.privateKey );
console.log( JSON.stringify( trx.data ) );

