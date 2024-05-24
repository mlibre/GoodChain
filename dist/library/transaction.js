import crypto from "crypto";
import { generateUuid } from "./utils.js";
export default class Transaction {
    from;
    to;
    amount;
    fee;
    transaction_number;
    signature;
    id;
    constructor({ from, to, amount, fee, transaction_number, signature, id }) {
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.fee = fee;
        this.transaction_number = transaction_number;
        this.signature = signature;
        this.id = id || generateUuid();
    }
    get data() {
        return {
            from: this.from,
            to: this.to,
            amount: this.amount,
            fee: this.fee,
            transaction_number: this.transaction_number,
            signature: this.signature,
            id: this.id
        };
    }
    get dataWithoutSignature() {
        return {
            from: this.from,
            to: this.to,
            amount: this.amount,
            fee: this.fee,
            transaction_number: this.transaction_number,
            id: this.id
        };
    }
    validate() {
        if (this.amount < 0) {
            throw new Error("Invalid amount");
        }
        if (this.isCoinBase()) {
            return true;
        }
        if (!this.to) {
            throw new Error("Invalid transaction: missing 'to' address");
        }
        this.verifySignature();
        return true;
    }
    verifySignature() {
        if (!this.signature || !this.from) {
            throw new Error("No signature or from");
        }
        const signature = Buffer.from(this.signature, "hex");
        const result = crypto.verify(null, Buffer.from(JSON.stringify(this.dataWithoutSignature)), this.from, signature);
        if (!result) {
            throw new Error("Invalid signature");
        }
        return result;
    }
    sign(privateKey) {
        const signature = crypto.sign(null, Buffer.from(JSON.stringify(this.dataWithoutSignature)), privateKey);
        this.signature = signature.toString("hex");
        return this.signature;
    }
    isCoinBase() {
        return this.from === null;
    }
}
//# sourceMappingURL=transaction.js.map