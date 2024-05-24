import Blockchain from "../library/main.js";
import Wallet from "../library/wallet.js";
import Transaction from "../library/transaction.js";
import POWConsensus from "../library/pow-consensus.js";
import fs from "fs";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

const TEST_DB_PATH = `${import.meta.dirname}/test-db`;

// Utility function to clean the test database directory
function cleanTestDB ()
{
	if ( fs.existsSync( TEST_DB_PATH ) )
	{
		fs.rmSync( TEST_DB_PATH, { recursive: true });
	}
}

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

describe( "Blockchain Test Suite", () =>
{
	beforeAll( () =>
	{
		cleanTestDB();
	}, 1000 );
	afterAll( () =>
	{
		cleanTestDB();
	}, 1000 );

	it( "serial test", () =>
	{
		const blockchain = initializeBlockchain(); // miner: 100

		const senderKeys = Wallet.generateKeyPair();
		const receiverKeys = Wallet.generateKeyPair();
		const newBlock = blockchain.mineNewBlock(); // miner: 200
		expect( newBlock.index ).toBe( 1 );

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
		expect( blockWithTransaction1.transactions.length ).toBe( 2 ); // including coinbase transaction

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

		const blockWithTransaction2 = blockchain.mineNewBlock(); // miner: 351
		expect( blockWithTransaction2.transactions.length ).toBe( 2 ); // including coinbase transaction

		const finalStateValid = blockchain.chain.validateChain();
		expect( finalStateValid ).toBe( true );

		const senderWalletBalance = blockchain.wallet.getBalance( senderKeys.publicKey );
		const receiverWalletBalance = blockchain.wallet.getBalance( receiverKeys.publicKey );
		const minerWalletBalance = blockchain.wallet.getBalance( minerKeys.publicKey );

		expect( senderWalletBalance ).toBe( 24 ); // 50 - 25 - 1 (fee)
		expect( receiverWalletBalance ).toBe( 25 ); // received 25
		expect( minerWalletBalance ).toBe( 351 ); // 200 (initial) + 50 + 1 + 1 + 100 (mining rewards)

		// Edge case: transaction with insufficient funds
		const transaction3 = new Transaction({
			from: senderKeys.publicKey,
			to: receiverKeys.publicKey,
			amount: 30, // more than sender's balance
			fee: 1,
			transaction_number: 2,
			signature: null
		});
		transaction3.sign( senderKeys.privateKey );
		try
		{
			blockchain.addTransaction( transaction3.data );
		}
		catch ( e )
		{
			if ( e instanceof Error )
			{
				expect( e.message ).toBe( "Insufficient funds" );
			}
			else
			{
				throw e;
			}
		}

		// Edge case: duplicate transaction number
		const transaction4 = new Transaction({
			from: senderKeys.publicKey,
			to: receiverKeys.publicKey,
			amount: 5,
			fee: 1,
			transaction_number: 1, // duplicate transaction number
			signature: null
		});
		transaction4.sign( senderKeys.privateKey );
		try
		{
			blockchain.addTransaction( transaction4.data );
		}
		catch ( e: unknown )
		{
			if ( e instanceof Error )
			{
				expect( e.message ).toBe( "Invalid transaction number" );
			}
			else
			{
				throw e;
			}
		}

		// Edge case: invalid signature
		const transaction5 = new Transaction({
			from: senderKeys.publicKey,
			to: receiverKeys.publicKey,
			amount: 5,
			fee: 1,
			transaction_number: 2,
			signature: "invalid-signature"
		});
		try
		{
			blockchain.addTransaction( transaction5.data );
		}
		catch ( e )
		{
			if ( e instanceof Error )
			{
				expect( e.message ).toBe( "Invalid signature" );
			}
			else
			{
				throw e;
			}
		}
	});
});
