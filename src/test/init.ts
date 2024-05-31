import Blockchain from "../library/main.js";
import Consensus from "../library/pow-consensus.js";
import Transaction from "../library/transaction.js";

import { deleteFile, deleteFolder, initJsonFile } from "../library/utils.js";
import Wallet from "../library/wallet.js";

deleteFolder( "assets/db/" );
deleteFile( "./assets/keys/miner.json" );
deleteFile( "./assets/keys/user.json" );

const userKeys = initJsonFile( "./assets/keys/user.json", Wallet.generateKeyPair() );
const minerKeys = initJsonFile( "./assets/keys/miner.json", Wallet.generateKeyPair() );
const blockchain = new Blockchain({
	dbPath: "./assets/db/",
	nodes: {
		list: [ "http://127.0.0.1:3001" ],
		hostUrl: "http://127.0.0.1:3000"
	},
	chainName: "GoodChain",
	minerPublicKey: minerKeys.publicKey,
	consensus: new Consensus()
});
await blockchain.init();
await blockchain.mineNewBlock();

const trx = new Transaction({
	from: minerKeys.publicKey,
	to: userKeys.publicKey,
	amount: 50,
	fee: 0,
	transaction_number: 1
});
trx.sign( minerKeys.privateKey );

const blockNumber = await blockchain.addTransaction( trx.data );
await blockchain.mineNewBlock();
console.log( "Mined block :", blockNumber, await blockchain.chain.latestBlock() );

const trx2 = new Transaction({
	from: userKeys.publicKey,
	to: "user3",
	amount: 5,
	fee: 0.3,
	transaction_number: 1
});
trx2.sign( userKeys.privateKey );

await blockchain.addTransaction( trx2.data );
await blockchain.mineNewBlock();

console.log( "Latest Block :", await blockchain.chain.latestBlock() );
console.log( "Wallets : ", await blockchain.wallet.allWallets() );
console.log( "chain validation:", await blockchain.chain.validateChain() );

