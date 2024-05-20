"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockify = exports.verifyGenesis = exports.verifyBlock = void 0;
var lodash_1 = require("lodash");
var transactions_js_1 = require("./transactions.js");
var utils_js_1 = require("./utils.js");
function verifyBlock(block, previousBlock) {
    var normalizedBlock = lodash_1.default.omit(block, ["hash"]);
    if (block.hash !== (0, utils_js_1.hashDataObject)(normalizedBlock)) {
        throw new Error("Invalid block hash");
    }
    if (normalizedBlock.chainName !== previousBlock.chainName) {
        throw new Error("Invalid chain name");
    }
    if (normalizedBlock.index !== previousBlock.index + 1) {
        throw new Error("Invalid index");
    }
    if (previousBlock.hash !== block.previousHash) {
        throw new Error("Invalid previous hash");
    }
    if (block.timestamp < previousBlock.timestamp) {
        throw new Error("Block timestamp must be greater than previous block timestamp");
    }
    for (var _i = 0, _a = block.transactions; _i < _a.length; _i++) {
        var transaction = _a[_i];
        var transactionInstance = new transactions_js_1.default(transaction);
        transactionInstance.validate();
    }
}
exports.verifyBlock = verifyBlock;
function verifyGenesis(block) {
    var normalizedBlock = lodash_1.default.omit(block, ["hash"]);
    if (block.hash !== (0, utils_js_1.hashDataObject)(normalizedBlock)) {
        throw new Error("Invalid block hash");
    }
}
exports.verifyGenesis = verifyGenesis;
function blockify(data) {
    return JSON.parse(JSON.stringify(data));
}
exports.blockify = blockify;
