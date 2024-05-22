import Transaction from "../library/transactions.js";
import { initJsonFile } from "../library/utils.js";

const minerKeys = initJsonFile( "./assets/keys/miner.json" );
const userKeys = initJsonFile( "./assets/keys/user.json" );

const trx = new Transaction({
	from: minerKeys.publicKey,
	to: userKeys.publicKey,
	amount: 50,
	fee: 0,
	transaction_number: 1
});
trx.signature = trx.sign( minerKeys.privateKey );
console.log( JSON.stringify( trx.data ) );

