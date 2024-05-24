import crypto from "crypto";
import Transaction from "./transaction.js";
import { initJsonFile, generateFilePath, updateFile } from "./utils.js";
class Wallet {
    filePath;
    wallet;
    constructor(folderPath) {
        this.filePath = generateFilePath(folderPath, "wallet", "wallet.json");
        this.wallet = initJsonFile(this.filePath, { blockNumber: -1, list: {} });
    }
    get allData() {
        return this.wallet;
    }
    performTransactions(transactionList) {
        for (const tmpTrx of transactionList) {
            const trx = new Transaction(tmpTrx);
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
    }
    cleanupTransactions(transactions) {
        const newTransactions = [];
        for (const tmpTrx of transactions) {
            try {
                const trx = new Transaction(tmpTrx);
                if (trx.isCoinBase()) {
                    console.warn("Dropping coinbase transaction");
                    continue;
                }
                if (trx.from !== null) {
                    if (trx.transaction_number <= this.transactionNumber(trx.from)) {
                        console.warn("Dropping transaction with transaction number less than wallet transaction number");
                        continue;
                    }
                    this.minusBalance(trx.from, trx.amount + trx.fee);
                    this.incrementTN(trx.from);
                }
                this.addBalance(trx.to, trx.amount);
                newTransactions.push(trx.data);
            }
            catch (error) {
                console.error(error);
            }
        }
        this.reloadDB();
        return newTransactions;
    }
    incrementTN(address) {
        this.validateAddress(address);
        return ++this.wallet.list[address].transaction_number;
    }
    getBalance(address) {
        return this.wallet.list[address].balance;
    }
    addBalance(address, amount) {
        this.validateAddress(address);
        return this.wallet.list[address].balance += amount;
    }
    minusBalance(address, amount) {
        this.validateAddress(address);
        if (this.getBalance(address) < amount) {
            throw new Error("Insufficient balance", { cause: { address, amount } });
        }
        return this.wallet.list[address].balance -= amount;
    }
    transactionNumber(address) {
        return this.wallet.list[address].transaction_number;
    }
    validateAddress(address) {
        if (!this.wallet.list[address]) {
            this.wallet.list[address] = { balance: 0, transaction_number: 0 };
        }
    }
    isTransactionNumberCorrect(address, transaction_number) {
        if (transaction_number <= this.transactionNumber(address)) {
            throw new Error("Invalid transaction number", { cause: { address, transaction_number } });
        }
    }
    checkFinalDBState(proposedBlock) {
        this.reloadDB();
        if (this.wallet.blockNumber !== proposedBlock.index) {
            throw new Error("Block number mismatch", { cause: { proposedBlock, wallet: this.wallet } });
        }
    }
    reCalculateWallet(chain) {
        this.wipe();
        for (const block of chain) {
            this.performTransactions(block.transactions);
        }
    }
    reloadDB() {
        this.wallet = initJsonFile(this.filePath, { blockNumber: 0, list: {} });
    }
    wipe() {
        this.wallet = { blockNumber: -1, list: {} };
        this.updateDB();
    }
    updateDB() {
        updateFile(this.filePath, this.wallet);
    }
    static generateKeyPair() {
        const keyPair = crypto.generateKeyPairSync("ed25519");
        const publicKey = keyPair.publicKey.export({ type: "spki", format: "pem" }).toString();
        const privateKey = keyPair.privateKey.export({ type: "pkcs8", format: "pem" }).toString();
        return { publicKey, privateKey };
    }
}
export default Wallet;
//# sourceMappingURL=wallet.js.map