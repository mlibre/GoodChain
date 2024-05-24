import Blockchain from "../library/main.js";
import Wallet from "../library/wallet.js";
import Transaction from "../library/transaction.js";
import POWConsensus from "../library/pow-consensus.js";
import fs from "fs";
import { test } from "node:test";
import assert from "node:assert";
const TEST_DB_PATH = `${import.meta.dirname}/test-db`;
// Utility function to clean the test database directory
function cleanTestDB() {
    if (fs.existsSync(TEST_DB_PATH)) {
        fs.rmSync(TEST_DB_PATH, { recursive: true });
    }
    fs.mkdirSync(TEST_DB_PATH);
}
// Initialize the test environment
const minerKeys = Wallet.generateKeyPair();
function initializeBlockchain() {
    const consensus = new POWConsensus();
    return new Blockchain({
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
test("Blockchain Test Suite", async (t) => {
    cleanTestDB();
    const blockchain = initializeBlockchain(); // miner: 100
    const senderKeys = Wallet.generateKeyPair();
    const receiverKeys = Wallet.generateKeyPair();
    await t.test("Mine initial block", async () => {
        const newBlock = blockchain.mineNewBlock(); // miner: 200
        console.log("New block mined:", newBlock);
        assert.strictEqual(newBlock.index, 1, "First block should be mined");
    });
    await t.test("Create and mine transaction from miner to sender", async () => {
        const transaction1 = new Transaction({
            from: minerKeys.publicKey,
            to: senderKeys.publicKey,
            amount: 50,
            fee: 1,
            transaction_number: 1,
            signature: null
        });
        transaction1.sign(minerKeys.privateKey);
        blockchain.addTransaction(transaction1.data);
        const blockWithTransaction1 = blockchain.mineNewBlock(); // miner: 250, miner receives his own trx fee
        console.log("Block with transaction 1 mined:", blockWithTransaction1);
        assert.strictEqual(blockWithTransaction1.transactions.length, 1, "Block should contain 1 transaction");
    });
    await t.test("Create and mine transaction from sender to receiver", async () => {
        const transaction2 = new Transaction({
            from: senderKeys.publicKey,
            to: receiverKeys.publicKey,
            amount: 25,
            fee: 1,
            transaction_number: 1,
            signature: null
        });
        transaction2.sign(senderKeys.privateKey);
        blockchain.addTransaction(transaction2.data);
        const blockWithTransaction2 = blockchain.mineNewBlock();
        console.log("Block with transaction 2 mined:", blockWithTransaction2);
        assert.strictEqual(blockWithTransaction2.transactions.length, 1, "Block should contain 1 transaction");
    });
    await t.test("Validate final blockchain state and balances", async () => {
        const finalStateValid = blockchain.chain.validateChain();
        assert.strictEqual(finalStateValid, true, "Blockchain state should be valid");
        const senderWalletBalance = blockchain.wallet.getBalance(senderKeys.publicKey);
        const receiverWalletBalance = blockchain.wallet.getBalance(receiverKeys.publicKey);
        const minerWalletBalance = blockchain.wallet.getBalance(minerKeys.publicKey);
        console.log("Sender wallet balance:", senderWalletBalance);
        console.log("Receiver wallet balance:", receiverWalletBalance);
        console.log("Miner wallet balance:", minerWalletBalance);
        assert.strictEqual(senderWalletBalance, 24, "Invalid sender wallet balance");
        assert.strictEqual(receiverWalletBalance, 25, "Invalid receiver wallet balance");
        assert.strictEqual(minerWalletBalance, 351, "Invalid miner wallet balance"); // Including mining rewards and fees
    });
});
//# sourceMappingURL=blockchain.test.js.map