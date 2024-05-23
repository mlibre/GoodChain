// import Blockchain from "../library/main.js";
// import Wallet from "../library/wallet.js";
// import Transaction from "../library/transaction.js";
// import POWConsensus from "../library/pow-consensus.js";
// import fs from "fs";
export {};
// const TEST_DB_PATH = "./test-db";
// // Utility function to clean the test database directory
// function cleanTestDB ()
// {
// 	if ( fs.existsSync( TEST_DB_PATH ) )
// 	{
// 		fs.rmSync( TEST_DB_PATH, { recursive: true });
// 	}
// 	fs.mkdirSync( TEST_DB_PATH );
// }
// // Initialize the test environment
// function initializeBlockchain ()
// {
// 	const minerKeys = Wallet.generateKeyPair();
// 	const consensus = new POWConsensus();
// 	return new Blockchain({
// 		dbPath: TEST_DB_PATH,
// 		nodes: { list: [] },
// 		chainName: "test-chain",
// 		minerKeys,
// 		consensus
// 	});
// }
// // Main test function
// async function main ()
// {
// 	cleanTestDB();
// 	// Initialize blockchain
// 	const blockchain = initializeBlockchain();
// 	// Miner key pair
// 	const { minerKeys } = blockchain;
// 	// Generate key pairs for two wallets
// 	const senderKeys = Wallet.generateKeyPair();
// 	const receiverKeys = Wallet.generateKeyPair();
// 	// Mine the genesis block
// 	blockchain.minGenesisBlock();
// 	// Mine a new block
// 	const newBlock = blockchain.mineNewBlock();
// 	console.log( "New block mined:", newBlock );
// 	// Create a transaction from miner to sender
// 	const transaction1 = new Transaction({
// 		from: minerKeys.publicKey,
// 		to: senderKeys.publicKey,
// 		amount: 50,
// 		fee: 1,
// 		transaction_number: 1,
// 		signature: null
// 	});
// 	transaction1.sign( minerKeys.privateKey );
// 	// Add the transaction to the blockchain
// 	blockchain.addTransaction( transaction1.data );
// 	// Mine a block containing the transaction
// 	const blockWithTransaction1 = blockchain.mineNewBlock();
// 	console.log( "Block with transaction 1 mined:", blockWithTransaction1 );
// 	// Create a transaction from sender to receiver
// 	const transaction2 = new Transaction({
// 		from: senderKeys.publicKey,
// 		to: receiverKeys.publicKey,
// 		amount: 25,
// 		fee: 1,
// 		transaction_number: 1,
// 		signature: null
// 	});
// 	transaction2.sign( senderKeys.privateKey );
// 	// Add the transaction to the blockchain
// 	blockchain.addTransaction( transaction2.data );
// 	// Mine a block containing the transaction
// 	const blockWithTransaction2 = blockchain.mineNewBlock();
// 	console.log( "Block with transaction 2 mined:", blockWithTransaction2 );
// 	// Validate final state
// 	const finalStateValid = blockchain.chain.validateChain();
// 	console.assert( finalStateValid, "Blockchain state is invalid" );
// 	const senderWalletBalance = blockchain.wallet.getBalance( senderKeys.publicKey );
// 	const receiverWalletBalance = blockchain.wallet.getBalance( receiverKeys.publicKey );
// 	const minerWalletBalance = blockchain.wallet.getBalance( minerKeys.publicKey );
// 	console.log( "Sender wallet balance:", senderWalletBalance );
// 	console.log( "Receiver wallet balance:", receiverWalletBalance );
// 	console.log( "Miner wallet balance:", minerWalletBalance );
// 	console.assert( senderWalletBalance === 24, "Invalid sender wallet balance" );
// 	console.assert( receiverWalletBalance === 25, "Invalid receiver wallet balance" );
// 	console.assert( minerWalletBalance >= 101, "Invalid miner wallet balance" ); // Including mining rewards and fees
// }
// // Run the main test function
// main().catch( console.error );
//# sourceMappingURL=blockchain.test.js.map