"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var transactions_js_1 = require("./transactions.js");
var utils_js_1 = require("./utils.js");
var Wallet = /** @class */ (function () {
    function Wallet(folderPath) {
        this.filePath = (0, utils_js_1.makeFilePath)(folderPath, "wallet", "wallet.json");
        this.wallet = (0, utils_js_1.initJsonFile)(this.filePath, { blockNumber: -1, list: {} });
    }
    Object.defineProperty(Wallet.prototype, "allData", {
        get: function () {
            return this.wallet;
        },
        enumerable: false,
        configurable: true
    });
    Wallet.prototype.performTransactions = function (transactionList) {
        for (var _i = 0, transactionList_1 = transactionList; _i < transactionList_1.length; _i++) {
            var tmpTrx = transactionList_1[_i];
            var trx = new transactions_js_1.default(tmpTrx);
            if (trx.isCoinBase()) {
                this.addBalance(trx.to, trx.amount);
                continue;
            }
            if (trx.from !== null) {
                this.minusBalance(trx.from, trx.amount + trx.fee);
                this.incrementTN(trx.from);
            }
            this.addBalance(trx.to, trx.amount);
        }
        this.wallet.blockNumber++;
        this.updateDB();
        return transactionList;
    };
    Wallet.prototype.cleanupTransactions = function (transactions) {
        var newTransactions = [];
        for (var _i = 0, transactions_1 = transactions; _i < transactions_1.length; _i++) {
            var tmpTrx = transactions_1[_i];
            try {
                var trx = new transactions_js_1.default(tmpTrx);
                if (trx.isCoinBase()) {
                    console.log("Dropping coinbase transaction");
                    continue;
                }
                if (trx.from !== null) {
                    if (trx.transaction_number <= this.transactionNumber(trx.from)) {
                        console.log("Dropping transaction with transaction number less than wallet transaction number");
                        continue;
                    }
                    this.minusBalance(trx.from, trx.amount + trx.fee);
                    this.incrementTN(trx.from);
                }
                this.addBalance(trx.to, trx.amount);
                newTransactions.push(trx.data);
            }
            catch (error) {
                console.log(error);
            }
        }
        this.reloadDB();
        return newTransactions;
    };
    Wallet.prototype.incrementTN = function (address) {
        this.validateAddress(address);
        return ++this.wallet.list[address].transaction_number;
    };
    Wallet.prototype.balance = function (address) {
        return this.wallet.list[address].balance;
    };
    Wallet.prototype.addBalance = function (address, amount) {
        this.validateAddress(address);
        return this.wallet.list[address].balance += amount;
    };
    Wallet.prototype.minusBalance = function (address, amount) {
        this.validateAddress(address);
        if (this.balance(address) < amount) {
            throw new Error("Insufficient balance", { cause: { address: address, amount: amount } });
        }
        return this.wallet.list[address].balance -= amount;
    };
    Wallet.prototype.transactionNumber = function (address) {
        return this.wallet.list[address].transaction_number;
    };
    Wallet.prototype.validateAddress = function (address) {
        if (address) {
            this.wallet.list[address] = { balance: 0, transaction_number: 0 };
        }
    };
    Wallet.prototype.isTransactionNumberCorrect = function (address, transaction_number) {
        if (transaction_number <= this.transactionNumber(address)) {
            throw new Error("Invalid transaction number", { cause: { address: address, transaction_number: transaction_number } });
        }
    };
    Wallet.prototype.checkFinalDBState = function (proposedBlock) {
        this.reloadDB();
        if (this.wallet.blockNumber !== proposedBlock.index) {
            throw new Error("Block number mismatch", { cause: { proposedBlock: proposedBlock, wallet: this.wallet } });
        }
    };
    Wallet.prototype.reCalculateWallet = function (chain) {
        this.wipe();
        for (var _i = 0, chain_1 = chain; _i < chain_1.length; _i++) {
            var block = chain_1[_i];
            this.performTransactions(block.transactions);
        }
    };
    Wallet.prototype.reloadDB = function () {
        this.wallet = (0, utils_js_1.initJsonFile)(this.filePath, { blockNumber: 0, list: {} });
    };
    Wallet.prototype.wipe = function () {
        this.wallet = { blockNumber: -1, list: {} };
        this.updateDB();
    };
    Wallet.prototype.updateDB = function () {
        (0, utils_js_1.updateFile)(this.filePath, this.wallet);
    };
    return Wallet;
}());
exports.default = Wallet;
