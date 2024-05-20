"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var block_js_1 = require("./block.js");
var chain_js_1 = require("./chain.js");
var db_git_js_1 = require("./db-git.js");
var nodes_js_1 = require("./nodes.js");
var transactions_js_1 = require("./transactions.js");
var utils_js_1 = require("./utils.js");
var wallet_js_1 = require("./wallet.js");
var Blockchain = /** @class */ (function () {
    function Blockchain(_a) {
        var dbPath = _a.dbPath, nodes = _a.nodes, chainName = _a.chainName, minerKeys = _a.minerKeys, consensus = _a.consensus;
        this.consensus = consensus;
        this.chainName = chainName;
        this.minerKeys = minerKeys;
        this.db = new db_git_js_1.default(dbPath);
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
    Blockchain.prototype.minGenesisBlock = function () {
        var self = this;
        try {
            self.db.reset();
            var coinbaseTrx = self.genCoinbaseTransaction();
            self.addTransaction(coinbaseTrx);
            var block = {
                index: self.chain.length,
                chainName: self.chainName,
                timestamp: Date.now(),
                transactions: self.transactionPool,
                previousHash: "",
                miner: self.minerKeys.publicKey
            };
            self.consensus.applyGenesis(block);
            block.hash = (0, utils_js_1.hashDataObject)(block);
            return self.addBlock(block);
        }
        catch (error) {
            self.db.reset();
            self.wallet.reloadDB();
            throw error;
        }
    };
    Blockchain.prototype.mineNewBlock = function () {
        var _a;
        var self = this;
        try {
            self.transactionPool = self.wallet.cleanupTransactions(self.transactionPool);
            self.db.reset();
            var coinbaseTrx = self.genCoinbaseTransaction();
            self.addTransaction(coinbaseTrx);
            var block = {
                index: self.chain.length,
                chainName: self.chainName,
                timestamp: Date.now(),
                transactions: self.transactionPool,
                previousHash: ((_a = self.chain.latestBlock) === null || _a === void 0 ? void 0 : _a.hash) || "",
                miner: self.minerKeys.publicKey
            };
            self.consensus.apply(block, self.chain.get(block.index - 1));
            block.hash = (0, utils_js_1.hashDataObject)(block);
            return self.addBlock(block);
        }
        catch (error) {
            self.db.reset();
            self.wallet.reloadDB();
            throw error;
        }
    };
    Blockchain.prototype.addBlock = function (block) {
        var newBlock = (0, block_js_1.blockify)(block);
        this.verifyCondidateBlock(newBlock);
        this.wallet.performTransactions(newBlock.transactions);
        this.wallet.checkFinalDBState(newBlock);
        this.chain.push(newBlock);
        this.chain.checkFinalDBState(newBlock);
        this.transactionPool = [];
        this.db.commit(newBlock.index);
        return newBlock;
    };
    Blockchain.prototype.addBlocks = function (blocks) {
        for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
            var block = blocks_1[_i];
            this.addBlock(block);
        }
        return blocks;
    };
    Blockchain.prototype.getBlocks = function (from, to) {
        return this.chain.getRange(from, to);
    };
    Blockchain.prototype.verifyCondidateBlock = function (block) {
        if (block.index == 0) {
            (0, block_js_1.verifyGenesis)(block);
            this.consensus.validateGenesis(block);
        }
        else {
            (0, block_js_1.verifyBlock)(block, this.chain.latestBlock);
            this.consensus.validate(block, this.chain.latestBlock);
        }
        return true;
    };
    Blockchain.prototype.addTransaction = function (transaction) {
        this.checkTransactionsPoolSize();
        var trx = new transactions_js_1.default(transaction);
        if (!trx.isCoinBase() && trx.from !== null) {
            this.wallet.validateAddress(trx.from);
            this.wallet.isTransactionNumberCorrect(trx.from, trx.transaction_number);
        }
        this.wallet.validateAddress(trx.to);
        trx.validate();
        this.isTransactionDuplicate(trx.data);
        this.transactionPool.push(trx.data);
        this.transactionPool.sort(function (a, b) {
            return b.fee - a.fee;
        });
        return this.chain.length;
    };
    Blockchain.prototype.addTransactions = function (transactions) {
        var results = [];
        for (var _i = 0, transactions_1 = transactions; _i < transactions_1.length; _i++) {
            var transaction = transactions_1[_i];
            try {
                results.push({
                    id: transaction.id,
                    blockNumber: this.addTransaction(transaction)
                });
            }
            catch (error) {
                results.push({
                    id: transaction.id,
                    error: error
                });
            }
        }
        return results;
    };
    Blockchain.prototype.genCoinbaseTransaction = function () {
        return {
            from: null,
            to: this.minerKeys.publicKey,
            amount: this.miningReward + (0, utils_js_1.calculateMiningFee)(this.transactionPool),
            fee: 0,
            transaction_number: 0,
            signature: null
        };
    };
    Blockchain.prototype.checkTransactionsPoolSize = function () {
        if (this.transactionPool.length >= this.transactionPoolSize) {
            throw new Error("Transaction pool is full");
        }
    };
    Blockchain.prototype.isTransactionDuplicate = function (_a) {
        var from = _a.from, to = _a.to, amount = _a.amount, fee = _a.fee, transaction_number = _a.transaction_number, signature = _a.signature;
        var duplicate = lodash_1.default.find(this.transactionPool, { from: from, to: to, amount: amount, fee: fee, transaction_number: transaction_number, signature: signature });
        if (duplicate) {
            throw new Error("Duplicate transaction");
        }
    };
    Blockchain.prototype.addNode = function (url) {
        return this.nodes.add(url);
    };
    Blockchain.prototype.replaceChain = function (newChain) {
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
    };
    return Blockchain;
}());
exports.default = Blockchain;
