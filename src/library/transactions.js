"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var utils_js_1 = require("./utils.js");
var Transaction = /** @class */ (function () {
    function Transaction(_a) {
        var from = _a.from, to = _a.to, amount = _a.amount, fee = _a.fee, transaction_number = _a.transaction_number, signature = _a.signature, id = _a.id;
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.fee = fee;
        this.transaction_number = transaction_number;
        this.signature = signature;
        this.id = id || (0, utils_js_1.generateUuid)();
    }
    Object.defineProperty(Transaction.prototype, "data", {
        get: function () {
            return {
                from: this.from,
                to: this.to,
                amount: this.amount,
                fee: this.fee,
                transaction_number: this.transaction_number,
                signature: this.signature,
                id: this.id
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transaction.prototype, "dataWithoutSignature", {
        get: function () {
            return {
                from: this.from,
                to: this.to,
                amount: this.amount,
                fee: this.fee,
                transaction_number: this.transaction_number,
                id: this.id
            };
        },
        enumerable: false,
        configurable: true
    });
    Transaction.prototype.validate = function () {
        if (this.amount < 0) {
            throw new Error("Invalid amount");
        }
        if (this.isCoinBase()) {
            return true;
        }
        if (!this.to) {
            throw new Error("Invalid transaction");
        }
        this.verifySignature();
        return true;
    };
    Transaction.prototype.verifySignature = function () {
        if (!this.signature || !this.from) {
            throw new Error("No signature or from");
        }
        var signature = Buffer.from(this.signature, "hex");
        var result = crypto_1.default.verify(null, Buffer.from(JSON.stringify(this.dataWithoutSignature)), this.from, signature);
        if (!result) {
            throw new Error("Invalid signature");
        }
        return result;
    };
    Transaction.prototype.sign = function (privateKey) {
        var signature = crypto_1.default.sign(null, Buffer.from(JSON.stringify(this.dataWithoutSignature)), privateKey);
        this.signature = signature.toString("hex");
        return this.signature;
    };
    Transaction.prototype.isCoinBase = function () {
        return this.from === null;
    };
    return Transaction;
}());
exports.default = Transaction;
