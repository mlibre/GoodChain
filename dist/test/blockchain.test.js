import Blockchain from "../library/main.js";
import Wallet from "../library/wallet.js";
import Transaction from "../library/transaction.js";
import POWConsensus from "../library/pow-consensus.js";
import fs from "fs";
import { describe, test, expect, beforeAll, afterAll } from "vitest";
const TEST_DB_PATH = `${import.meta.dirname}/test-db`;
describe("Blockchain Test Suite", () => {
    let blockchain;
    let senderKeys;
    let receiverKeys;
    let minerKeys;
    beforeAll(() => {
        cleanTestDB();
        minerKeys = Wallet.generateKeyPair();
        blockchain = initializeBlockchain(minerKeys.publicKey); // miner: 100
        senderKeys = Wallet.generateKeyPair();
        receiverKeys = Wallet.generateKeyPair();
    });
    afterAll(() => {
        cleanTestDB();
    });
    test("mining first block", () => {
        const newBlock = blockchain.mineNewBlock(); // miner: 200
        expect(newBlock.index).toBe(1);
    });
    test("Sending a transaction from miner to sender and mining a new block", () => {
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
        expect(blockWithTransaction1.transactions.length).toBe(2); // including coinbase transaction
    });
    test("Sending a transaction from sender to receiver and mining a new block", () => {
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
        const blockWithTransaction2 = blockchain.mineNewBlock(); // miner: 351
        expect(blockWithTransaction2.transactions.length).toBe(2); // including coinbase transaction
    });
    test("Validating the final state of the blockchain", () => {
        const finalStateValid = blockchain.chain.validateChain();
        expect(finalStateValid).toBe(true);
    });
    test("Validating wallet balances after transactions", () => {
        const senderWalletBalance = blockchain.wallet.getBalance(senderKeys.publicKey);
        const receiverWalletBalance = blockchain.wallet.getBalance(receiverKeys.publicKey);
        const minerWalletBalance = blockchain.wallet.getBalance(minerKeys.publicKey);
        expect(senderWalletBalance).toBe(24); // 50 - 25 - 1 (fee)
        expect(receiverWalletBalance).toBe(25); // received 25
        expect(minerWalletBalance).toBe(351); // 100 + 100 + 50 + 1 + 100
    });
    test("Handling transaction with insufficient funds", () => {
        const transaction3 = new Transaction({
            from: senderKeys.publicKey,
            to: receiverKeys.publicKey,
            amount: 30, // more than sender's balance
            fee: 1,
            transaction_number: 2,
            signature: null
        });
        transaction3.sign(senderKeys.privateKey);
        try {
            blockchain.addTransaction(transaction3.data);
        }
        catch (e) {
            if (e instanceof Error) {
                expect(e.message).toBe("Insufficient funds");
            }
            else {
                throw e;
            }
        }
    });
    test("Handling duplicate transaction number", () => {
        const transaction4 = new Transaction({
            from: senderKeys.publicKey,
            to: receiverKeys.publicKey,
            amount: 5,
            fee: 1,
            transaction_number: 1, // duplicate transaction number
            signature: null
        });
        transaction4.sign(senderKeys.privateKey);
        try {
            blockchain.addTransaction(transaction4.data);
        }
        catch (e) {
            if (e instanceof Error) {
                expect(e.message).toBe("Invalid transaction number");
            }
            else {
                throw e;
            }
        }
    });
    test("Handling invalid signature", () => {
        const transaction5 = new Transaction({
            from: senderKeys.publicKey,
            to: receiverKeys.publicKey,
            amount: 5,
            fee: 1,
            transaction_number: 2,
            signature: "invalid-signature"
        });
        try {
            blockchain.addTransaction(transaction5.data);
        }
        catch (e) {
            if (e instanceof Error) {
                expect(e.message).toBe("Invalid signature");
            }
            else {
                throw e;
            }
        }
    });
});
function cleanTestDB() {
    if (fs.existsSync(TEST_DB_PATH)) {
        fs.rmSync(TEST_DB_PATH, { recursive: true });
    }
}
function initializeBlockchain(minerKeysPublicKey) {
    const consensus = new POWConsensus();
    return new Blockchain({
        dbPath: TEST_DB_PATH,
        nodes: {
            list: ["http://127.0.0.1:3001"],
            hostUrl: "http://127.0.0.1:3000"
        },
        chainName: "test-chain",
        minerPublicKey: minerKeysPublicKey,
        consensus
    });
}
//# sourceMappingURL=blockchain.test.js.map