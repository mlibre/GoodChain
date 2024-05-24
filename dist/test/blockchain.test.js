"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const main_js_1 = tslib_1.__importDefault(require("../library/main.js"));
const wallet_js_1 = tslib_1.__importDefault(require("../library/wallet.js"));
const transaction_js_1 = tslib_1.__importDefault(require("../library/transaction.js"));
const pow_consensus_js_1 = tslib_1.__importDefault(require("../library/pow-consensus.js"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const TEST_DB_PATH = "./test-db";
// Utility function to clean the test database directory
function cleanTestDB() {
    if (fs_1.default.existsSync(TEST_DB_PATH)) {
        fs_1.default.rmSync(TEST_DB_PATH, { recursive: true });
    }
    fs_1.default.mkdirSync(TEST_DB_PATH);
}
// Initialize the test environment
const minerKeys = wallet_js_1.default.generateKeyPair();
function initializeBlockchain() {
    const consensus = new pow_consensus_js_1.default();
    return new main_js_1.default({
        dbPath: TEST_DB_PATH,
        nodes: {
            list: ["http://127.0.0.1:3001"],
            hostUrl: "http://127.0.0.1:3000"
        },
        chainName: "test-chain",
        minerPublicKey: minerKeys.publicKey,
        consensus
    });
}
// Main test function
async function main() {
    cleanTestDB();
    // Initialize blockchain
    const blockchain = initializeBlockchain();
    // Generate key pairs for two wallets
    const senderKeys = wallet_js_1.default.generateKeyPair();
    const receiverKeys = wallet_js_1.default.generateKeyPair();
    // Mine the genesis block
    blockchain.minGenesisBlock();
    // Mine a new block
    const newBlock = blockchain.mineNewBlock();
    console.log("New block mined:", newBlock);
    // Create a transaction from miner to sender
    const transaction1 = new transaction_js_1.default({
        from: minerKeys.publicKey,
        to: senderKeys.publicKey,
        amount: 50,
        fee: 1,
        transaction_number: 1,
        signature: null
    });
    transaction1.sign(minerKeys.privateKey);
    // Add the transaction to the blockchain
    blockchain.addTransaction(transaction1.data);
    // Mine a block containing the transaction
    const blockWithTransaction1 = blockchain.mineNewBlock();
    console.log("Block with transaction 1 mined:", blockWithTransaction1);
    // Create a transaction from sender to receiver
    const transaction2 = new transaction_js_1.default({
        from: senderKeys.publicKey,
        to: receiverKeys.publicKey,
        amount: 25,
        fee: 1,
        transaction_number: 1,
        signature: null
    });
    transaction2.sign(senderKeys.privateKey);
    // Add the transaction to the blockchain
    blockchain.addTransaction(transaction2.data);
    // Mine a block containing the transaction
    const blockWithTransaction2 = blockchain.mineNewBlock();
    console.log("Block with transaction 2 mined:", blockWithTransaction2);
    // Validate final state
    const finalStateValid = blockchain.chain.validateChain();
    console.assert(finalStateValid, "Blockchain state is invalid");
    const senderWalletBalance = blockchain.wallet.getBalance(senderKeys.publicKey);
    const receiverWalletBalance = blockchain.wallet.getBalance(receiverKeys.publicKey);
    const minerWalletBalance = blockchain.wallet.getBalance(minerKeys.publicKey);
    console.log("Sender wallet balance:", senderWalletBalance);
    console.log("Receiver wallet balance:", receiverWalletBalance);
    console.log("Miner wallet balance:", minerWalletBalance);
    console.assert(senderWalletBalance === 24, "Invalid sender wallet balance");
    console.assert(receiverWalletBalance === 25, "Invalid receiver wallet balance");
    console.assert(minerWalletBalance >= 101, "Invalid miner wallet balance"); // Including mining rewards and fees
}
// Run the main test function
main().catch(console.error);
//# sourceMappingURL=blockchain.test.js.map