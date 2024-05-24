import Blockchain from "../library/main.js";
import Wallet from "../library/wallet.js";
import Transaction from "../library/transaction.js";
import POWConsensus from "../library/pow-consensus.js";
import fs from "fs";
import { expect, test } from "vitest";

const TEST_DB_PATH = `${import.meta.dirname}/test-db`;

// Utility function to clean the test database directory
function cleanTestDB ()
{
	if ( fs.existsSync( TEST_DB_PATH ) )
	{
		fs.rmSync( TEST_DB_PATH, { recursive: true });
	}
}

// Initialize the test environment
const minerKeys = Wallet.generateKeyPair();
function initializeBlockchain ()
{
	const consensus = new POWConsensus();
	return new Blockchain({
		dbPath: TEST_DB_PATH,
		nodes: {
			list: [ "http://127.0.0.1:3001" ],
			hostUrl: "http://127.0.0.1:3000"
		},
		chainName: "test-chain",
		minerPublicKey: minerKeys.publicKey,
		consensus
	});
}

test( "Blockchain Test Suite", async ( t ) =>
{
	cleanTestDB();

	const blockchain = initializeBlockchain(); // miner: 100

	const senderKeys = Wallet.generateKeyPair();
	const receiverKeys = Wallet.generateKeyPair();


	const newBlock = blockchain.mineNewBlock(); // miner: 200
	expect( newBlock.index ).toBe( 1 ); // Changed from assert.strictEqual


	const transaction1 = new Transaction({
		from: minerKeys.publicKey,
		to: senderKeys.publicKey,
		amount: 50,
		fee: 1,
		transaction_number: 1,
		signature: null
	});
	transaction1.sign( minerKeys.privateKey );
	blockchain.addTransaction( transaction1.data );

	const blockWithTransaction1 = blockchain.mineNewBlock(); // miner: 250, miner receives his own trx fee
	expect( blockWithTransaction1.transactions.length ).toBe( 2 ); // Changed from assert.strictEqual


	const transaction2 = new Transaction({
		from: senderKeys.publicKey,
		to: receiverKeys.publicKey,
		amount: 25,
		fee: 1,
		transaction_number: 1,
		signature: null
	});
	transaction2.sign( senderKeys.privateKey );
	blockchain.addTransaction( transaction2.data );

	const blockWithTransaction2 = blockchain.mineNewBlock();
	expect( blockWithTransaction2.transactions.length ).toBe( 2 ); // Changed from assert.strictEqual


	const finalStateValid = blockchain.chain.validateChain();
	expect( finalStateValid ).toBe( true );

	const senderWalletBalance = blockchain.wallet.getBalance( senderKeys.publicKey );
	const receiverWalletBalance = blockchain.wallet.getBalance( receiverKeys.publicKey );
	const minerWalletBalance = blockchain.wallet.getBalance( minerKeys.publicKey );

	console.log( "Sender wallet balance:", senderWalletBalance );
	console.log( "Receiver wallet balance:", receiverWalletBalance );
	console.log( "Miner wallet balance:", minerWalletBalance );
	expect( senderWalletBalance ).toBe( 24 );
	expect( receiverWalletBalance ).toBe( 25 );
	expect( minerWalletBalance ).toBe( 351 );

	cleanTestDB();
});
