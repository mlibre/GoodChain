import crypto from "crypto";
import _ from "lodash";
import Transaction from "./transaction.js";
import { isLevelNotFoundError } from "../guards.js";
class Wallet {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    db;
    constructor(leveldb) {
        this.db = leveldb.sublevel("wallet", { valueEncoding: "json" });
    }
    async allWallets() {
        const result = await this.db.iterator().all();
        return _.fromPairs(result);
    }
    async processTrxActionList(transactionList) {
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
        return actionList;
    }
    async cleanupTransactions(transactions) {
        const newTransactions = [];
        const wallets = await this.allWallets();
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
                    minusBalance(trx.from, trx.amount + trx.fee);
                }
                await addBalance(trx.to, trx.amount);
                newTransactions.push(trx.data);
            }
            catch (error) {
                console.error(error);
            }
        }
        return newTransactions;
        function minusBalance(address, amount) {
            if (!wallets[address]) {
                wallets[address] = {
                    balance: 0,
                    transaction_number: 0
                };
            }
            if (wallets[address].balance < amount) {
                throw new Error("Insufficient balance", { cause: { address, amount } });
            }
            wallets[address].balance -= amount;
            wallets[address].transaction_number++;
        }
        function addBalance(address, amount) {
            if (!wallets[address]) {
                wallets[address] = {
                    balance: 0,
                    transaction_number: 0
                };
            }
            wallets[address].balance += amount;
        }
    }
    async getBalance(address) {
        const wallet = await this.db.get(address.toString());
        return wallet;
    }
    async addBalance(address, amount) {
        await this.validateAddress(address);
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
        await this.validateAddress(address);
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
    async validateAddress(address) {
        try {
            await this.getBalance(address);
        }
        catch (error) {
            if (isLevelNotFoundError(error) && error.code === "LEVEL_NOT_FOUND") {
                await this.db.put(address, { balance: 0, transaction_number: 0 });
            }
            else {
                console.log(error);
                throw error;
            }
        }
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