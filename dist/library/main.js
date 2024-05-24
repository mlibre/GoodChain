"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const block_js_1 = require("./block.js");
const chain_js_1 = tslib_1.__importDefault(require("./chain.js"));
const database_js_1 = tslib_1.__importDefault(require("./database.js"));
const nodes_js_1 = tslib_1.__importDefault(require("./nodes.js"));
const transaction_js_1 = tslib_1.__importDefault(require("./transaction.js"));
const utils_js_1 = require("./utils.js");
const wallet_js_1 = tslib_1.__importDefault(require("./wallet.js"));
class Blockchain {
    consensus;
    chainName;
    minerPublicKey;
    db;
    chain;
    wallet;
    nodes;
    transactionPool;
    transactionPoolSize;
    miningReward;
    constructor({ dbPath, nodes, chainName, minerPublicKey, consensus }) {
        this.consensus = consensus;
        this.chainName = chainName;
        this.minerPublicKey = minerPublicKey;
        this.db = new database_js_1.default(dbPath);
        this.chain = new chain_js_1.default(dbPath);
        this.wallet = new wallet_js_1.default(dbPath);
        this.nodes = new nodes_js_1.default(dbPath, nodes);
        this.db.commit("-1");
        this.transactionPool = [];
        this.transactionPoolSize = 100;
        this.miningReward = 100;
        if (this.chain.length === 0) {
            this.minGenesisBlock();
        }
        this.consensus.setValues(this.chain.latestBlock);
    }
    minGenesisBlock() {
        const self = this;
        try {
            self.db.reset();
            const coinbaseTrx = self.genCoinbaseTransaction();
            self.addTransaction(coinbaseTrx);
            const block = {
                index: self.chain.length,
                chainName: self.chainName,
                timestamp: Date.now(),
                transactions: self.transactionPool,
                previousHash: "",
                miner: self.minerPublicKey
            };
            self.consensus.applyGenesis(block);
            block.hash = (0, utils_js_1.computeHash)(block);
            return self.addBlock(block);
        }
        catch (error) {
            self.db.reset();
            self.wallet.reloadDB();
            throw error;
        }
    }
    mineNewBlock() {
        const self = this;
        try {
            self.transactionPool = self.wallet.cleanupTransactions(self.transactionPool);
            self.db.reset();
            const coinbaseTrx = self.genCoinbaseTransaction();
            self.addTransaction(coinbaseTrx);
            const block = {
                index: self.chain.length,
                chainName: self.chainName,
                timestamp: Date.now(),
                transactions: self.transactionPool,
                previousHash: self.chain.latestBlock?.hash || "",
                miner: self.minerPublicKey
            };
            self.consensus.apply(block, self.chain.get(block.index - 1));
            block.hash = (0, utils_js_1.computeHash)(block);
            return self.addBlock(block);
        }
        catch (error) {
            self.db.reset();
            self.wallet.reloadDB();
            throw error;
        }
    }
    addBlock(block) {
        const newBlock = (0, block_js_1.blockify)(block);
        this.verifyCandidateBlock(newBlock);
        this.wallet.performTransactions(newBlock.transactions);
        this.wallet.checkFinalDBState(newBlock);
        this.chain.push(newBlock);
        this.chain.checkFinalDBState(newBlock);
        this.transactionPool = [];
        this.db.commit(newBlock.index);
        return newBlock;
    }
    addBlocks(blocks) {
        for (const block of blocks) {
            this.addBlock(block);
        }
        return blocks;
    }
    getBlocks(from, to) {
        return this.chain.getRange(from, to);
    }
    verifyCandidateBlock(block) {
        if (block.index == 0) {
            (0, block_js_1.verifyGenesisBlock)(block);
            this.consensus.validateGenesis(block);
        }
        else {
            (0, block_js_1.verifyBlock)(block, this.chain.latestBlock);
            this.consensus.validate(block, this.chain.latestBlock);
        }
        return true;
    }
    addTransaction(transaction) {
        this.checkTransactionsPoolSize();
        const trx = new transaction_js_1.default(transaction);
        if (!trx.isCoinBase() && trx.from !== null) {
            this.wallet.validateAddress(trx.from);
            this.wallet.isTransactionNumberCorrect(trx.from, trx.transaction_number);
        }
        this.wallet.validateAddress(trx.to);
        trx.validate();
        this.isTransactionDuplicate(trx.data);
        this.transactionPool.push(trx.data);
        this.transactionPool.sort((a, b) => {
            return b.fee - a.fee;
        });
        return this.chain.length;
    }
    addTransactions(transactions) {
        const results = [];
        for (const transaction of transactions) {
            try {
                results.push({
                    id: transaction.id,
                    blockNumber: this.addTransaction(transaction)
                });
            }
            catch (error) {
                results.push({
                    id: transaction.id,
                    error
                });
            }
        }
        return results;
    }
    genCoinbaseTransaction() {
        return {
            from: null,
            to: this.minerPublicKey,
            amount: this.miningReward + (0, utils_js_1.calculateMiningFee)(this.transactionPool),
            fee: 0,
            transaction_number: 0,
            signature: null
        };
    }
    checkTransactionsPoolSize() {
        if (this.transactionPool.length >= this.transactionPoolSize) {
            throw new Error("Transaction pool is full");
        }
    }
    isTransactionDuplicate({ from, to, amount, fee, transaction_number, signature }) {
        const duplicate = lodash_1.default.find(this.transactionPool, { from, to, amount, fee, transaction_number, signature });
        if (duplicate) {
            throw new Error("Duplicate transaction");
        }
    }
    addNode(url) {
        return this.nodes.add(url);
    }
    replaceChain(newChain) {
        try {
            this.chain.replaceBlocks(newChain);
            this.wallet.reCalculateWallet(this.chain.all);
            this.db.commit(this.chain.latestBlock.index);
        }
        catch (error) {
            this.db.reset();
            this.wallet.reloadDB();
            throw error;
        }
        return this.chain.all;
    }
}
exports.default = Blockchain;
//# sourceMappingURL=main.js.map