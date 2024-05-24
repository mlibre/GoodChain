import _ from "lodash";
import { verifyBlock, verifyGenesisBlock, blockify } from "./block.js";
import ChainStore from "./chain.js";
import Database from "./database.js";
import Nodes from "./nodes.js";
import Transaction from "./transaction.js";
import { calculateMiningFee, computeHash } from "./utils.js";
import Wallet from "./wallet.js";
export default class Blockchain {
    consensus;
    chainName;
    minerPublicKey;
    db;
    chain;
    wallet;
    nodes;
    transactionPool;
    transactionPoolSize;
    constructor({ dbPath, nodes, chainName, minerPublicKey, consensus }) {
        this.consensus = consensus;
        this.chainName = chainName;
        this.minerPublicKey = minerPublicKey;
        this.db = new Database(dbPath);
        this.chain = new ChainStore(dbPath);
        this.wallet = new Wallet(dbPath);
        this.nodes = new Nodes(dbPath, nodes);
        this.db.commit("-1");
        this.transactionPool = [];
        this.transactionPoolSize = 100;
        if (this.chain.length === 0) {
            this.#minGenesisBlock();
        }
        this.consensus.setValues(this.chain.latestBlock);
    }
    #minGenesisBlock() {
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
            block.hash = computeHash(block);
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
            block.hash = computeHash(block);
            return self.addBlock(block);
        }
        catch (error) {
            self.db.reset();
            self.wallet.reloadDB();
            throw error;
        }
    }
    addBlock(block) {
        const newBlock = blockify(block);
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
            verifyGenesisBlock(block);
            this.consensus.validateGenesis(block);
        }
        else {
            verifyBlock(block, this.chain.latestBlock);
            this.consensus.validate(block, this.chain.latestBlock);
        }
        return true;
    }
    addTransaction(transaction) {
        this.checkTransactionsPoolSize();
        const trx = new Transaction(transaction);
        if (!trx.isCoinBase() && trx.from !== null) {
            this.wallet.validateAddress(trx.from);
            this.wallet.isTransactionNumberCorrect(trx.from, trx.transaction_number);
        }
        this.wallet.validateAddress(trx.to);
        trx.validate();
        this.isTransactionDuplicate(trx.data.signature);
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
            amount: this.consensus.miningReward + calculateMiningFee(this.transactionPool),
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
    isTransactionDuplicate(signature) {
        const duplicate = _.find(this.transactionPool, { signature });
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
//# sourceMappingURL=main.js.map