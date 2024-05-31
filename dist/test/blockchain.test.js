import Blockchain from "../library/main.js";
import Wallet from "../library/wallet.js";
import Transaction from "../library/transaction.js";
import POWConsensus from "../library/pow-consensus.js";
import fs from "fs";
import { describe, test, expect, beforeAll, afterAll } from "vitest";
const TEST_DB_PATH = `${import.meta.dirname}/test-db`;
describe.sequential("Blockchain Test Suite", async () => {
    let blockchain;
    let senderKeys;
    let receiverKeys;
    let minerKeys;
    await beforeAll(async () => {
        await cleanTestDB(blockchain);
        minerKeys = Wallet.generateKeyPair();
        blockchain = await initializeBlockchain(minerKeys.publicKey); // miner: 100
        senderKeys = Wallet.generateKeyPair();
        receiverKeys = Wallet.generateKeyPair();
    }, 100000);
    await afterAll(async () => {
        await cleanTestDB(blockchain);
    }, 100000);
    await test.sequential("mining first block", async () => {
        const newBlock = await blockchain.mineNewBlock(); // miner: 200
        expect(newBlock.index).toBe(1);
        expect(await blockchain.chain.validateChain()).toBe(true);
    }, 100000);
    await test.sequential("Sending a transaction from miner to sender and mining a new block", async () => {
        const transaction1 = new Transaction({
            from: minerKeys.publicKey,
            to: senderKeys.publicKey,
            amount: 50,
            fee: 1,
            transaction_number: 1,
            signature: null
        });
        transaction1.sign(minerKeys.privateKey);
        await blockchain.addTransaction(transaction1.data);
        const blockWithTransaction1 = await blockchain.mineNewBlock(); // sender: 50, miner: 250, miner receives his own trx fee
        expect(blockWithTransaction1.transactions.length).toBe(2); // including coinbase transaction
        expect(await blockchain.chain.validateChain()).toBe(true);
    }, 100000);
    test.sequential("Sending a transaction from sender to receiver and mining a new block", async () => {
        const transaction2 = new Transaction({
            from: senderKeys.publicKey,
            to: receiverKeys.publicKey,
            amount: 25,
            fee: 1,
            transaction_number: 1,
            signature: null
        });
        transaction2.sign(senderKeys.privateKey);
        await blockchain.addTransaction(transaction2.data);
        const blockWithTransaction2 = await blockchain.mineNewBlock(); // miner: 351
        expect(blockWithTransaction2.transactions.length).toBe(2); // including coinbase transaction
        expect(await blockchain.chain.validateChain()).toBe(true);
    });
    test.sequential("Validating the final state of the blockchain", async () => {
        const finalStateValid = await blockchain.chain.validateChain();
        expect(finalStateValid).toBe(true);
    });
    test.sequential("Validating wallet balances after transactions", async () => {
        const senderWalletBalance = await blockchain.wallet.getBalance(senderKeys.publicKey);
        const receiverWalletBalance = await blockchain.wallet.getBalance(receiverKeys.publicKey);
        const minerWalletBalance = await blockchain.wallet.getBalance(minerKeys.publicKey);
        expect(senderWalletBalance.balance).toBe(24); // 50 - 25 - 1 (fee)
        expect(receiverWalletBalance.balance).toBe(25); // received 25
        expect(minerWalletBalance.balance).toBe(351); // 100 + 100 + 50 + 1 + 100
    });
    test.sequential("Handling transaction with insufficient funds", async () => {
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
            await blockchain.addTransaction(transaction3.data);
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
    test.sequential("Handling duplicate transaction number", async () => {
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
            await blockchain.addTransaction(transaction4.data);
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
    test.sequential("Handling invalid signature", async () => {
        const transaction5 = new Transaction({
            from: senderKeys.publicKey,
            to: receiverKeys.publicKey,
            amount: 5,
            fee: 1,
            transaction_number: 2,
            signature: "invalid-signature"
        });
        try {
            await blockchain.addTransaction(transaction5.data);
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
    test.sequential("Handling transaction with zero amount", async () => {
        const transaction6 = new Transaction({
            from: senderKeys.publicKey,
            to: receiverKeys.publicKey,
            amount: 0,
            fee: 1,
            transaction_number: 3,
            signature: null
        });
        transaction6.sign(senderKeys.privateKey);
        try {
            await blockchain.addTransaction(transaction6.data);
        }
        catch (e) {
            if (e instanceof Error) {
                expect(e.message).toBe("Invalid transaction amount");
            }
            else {
                throw e;
            }
        }
    });
    test.sequential("Handling transaction with negative amount", async () => {
        const transaction7 = new Transaction({
            from: senderKeys.publicKey,
            to: receiverKeys.publicKey,
            amount: -10,
            fee: 1,
            transaction_number: 4,
            signature: null
        });
        transaction7.sign(senderKeys.privateKey);
        try {
            await blockchain.addTransaction(transaction7.data);
        }
        catch (e) {
            if (e instanceof Error) {
                expect(e.message).toBe("Invalid amount");
            }
            else {
                throw e;
            }
        }
    });
}, 100000);
async function cleanTestDB(blockchain) {
    try {
        if (blockchain) {
            await blockchain.database.clear();
            await blockchain.database.close();
        }
        if (fs.existsSync(TEST_DB_PATH)) {
            fs.rmSync(TEST_DB_PATH, { recursive: true, force: true });
        }
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
async function initializeBlockchain(minerKeysPublicKey) {
    const consensus = new POWConsensus();
    const blockchain = new Blockchain({
        dbPath: TEST_DB_PATH,
        nodes: {
            list: ["http://127.0.0.1:3001"],
            hostUrl: "http://127.0.0.1:3000"
        },
        chainName: "test-chain",
        minerPublicKey: minerKeysPublicKey,
        consensus
    });
    await blockchain.init();
    return blockchain;
}
//# sourceMappingURL=blockchain.test.js.map