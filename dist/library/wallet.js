import crypto from "crypto";
import _ from "lodash";
import Transaction from "./transaction.js";
import { isLevelNotFoundError } from "../guards.js";
class Wallet {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    db;
    cacheWallet;
    constructor(leveldb) {
        this.db = leveldb.sublevel("wallet", { valueEncoding: "json" });
        this.cacheWallet = {};
    }
    async allWallets() {
        const result = await this.db.iterator().all();
        return _.fromPairs(result);
    }
    async processTrxActionList(transactionList) {
        this.cacheWallet = {};
        const actionList = [];
        for (const tmpTrx of transactionList) {
            const trx = new Transaction(tmpTrx);
            if (trx.isCoinBase()) {
                const action = await this.addBalance(trx.to, trx.amount);
                actionList.push(action);
                continue;
            }
            if (trx.from !== null) {
                const action = await this.minusBalance(trx.from, trx.amount + trx.fee);
                actionList.push(action);
            }
            const action = await this.addBalance(trx.to, trx.amount);
            actionList.push(action);
        }
        this.cacheWallet = {};
        return actionList;
    }
    async cleanupTransactions(transactions) {
        this.cacheWallet = {};
        const newTransactions = [];
        for (const tmpTrx of transactions) {
            try {
                const trx = new Transaction(tmpTrx);
                if (trx.isCoinBase()) {
                    console.warn("Dropping coinbase transaction");
                    continue;
                }
                if (trx.from !== null) {
                    const userWallet = await this.getBalance(trx.from);
                    if (trx.transaction_number <= userWallet.transaction_number) {
                        console.warn("Dropping transaction with transaction number less than wallet transaction number");
                        continue;
                    }
                    await this.minusBalance(trx.from, trx.amount + trx.fee);
                }
                await this.addBalance(trx.to, trx.amount); // todo you can use this.addbalance again
                newTransactions.push(trx.data);
            }
            catch (error) {
                console.error(error);
            }
        }
        this.cacheWallet = {};
        return newTransactions;
    }
    async getBalance(address) {
        if (this.cacheWallet[address]) {
            return this.cacheWallet[address];
        }
        try {
            const wallet = await this.db.get(address.toString());
            this.cacheWallet[address] = wallet;
            return wallet;
        }
        catch (error) {
            if (isLevelNotFoundError(error) && error.code === "LEVEL_NOT_FOUND") {
                await this.db.put(address, { balance: 0, transaction_number: 0 });
                const wallet = await this.db.get(address.toString());
                this.cacheWallet[address] = wallet;
                return wallet;
            }
            else {
                console.log(error);
                throw error;
            }
        }
    }
    async addBalance(address, amount) {
        const wallet = await this.getBalance(address);
        wallet.balance += amount;
        const action = {
            type: "put",
            sublevel: this.db,
            key: address,
            value: wallet
        };
        return action;
    }
    async minusBalance(address, amount) {
        const wallet = await this.getBalance(address);
        if (wallet.balance < amount) {
            throw new Error("Insufficient balance", { cause: { address, amount } });
        }
        wallet.balance -= amount;
        wallet.transaction_number++;
        const action = {
            type: "put",
            sublevel: this.db,
            key: address,
            value: wallet
        };
        return action;
    }
    async isTransactionNumberCorrect(address, transaction_number) {
        const wallet = await this.getBalance(address);
        if (transaction_number <= wallet.transaction_number) {
            throw new Error("Invalid transaction number", { cause: { address, transaction_number } });
        }
    }
    reCalculateWallet(chain) {
        this.wipe();
        for (const block of chain) {
            this.processTrxActionList(block.transactions);
        }
    }
    async wipe() {
        await this.db.clear();
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