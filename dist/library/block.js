"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockify = exports.verifyGenesisBlock = exports.verifyBlock = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const transaction_js_1 = tslib_1.__importDefault(require("./transaction.js"));
const utils_js_1 = require("./utils.js");
function verifyBlock(currentBlock, previousBlock) {
    const blockWithoutHash = lodash_1.default.omit(currentBlock, ["hash"]);
    if (currentBlock.hash !== (0, utils_js_1.computeHash)(blockWithoutHash)) {
        throw new Error("Invalid block hash");
    }
    if (blockWithoutHash.chainName !== previousBlock.chainName) {
        throw new Error("Invalid chain name");
    }
    if (blockWithoutHash.index !== previousBlock.index + 1) {
        throw new Error("Invalid index");
    }
    if (previousBlock.hash !== currentBlock.previousHash) {
        throw new Error("Invalid previous hash");
    }
    if (currentBlock.timestamp < previousBlock.timestamp) {
        throw new Error("Block timestamp must be greater than previous block timestamp");
    }
    for (const transaction of currentBlock.transactions) {
        const transactionInstance = new transaction_js_1.default(transaction);
        transactionInstance.validate();
    }
}
exports.verifyBlock = verifyBlock;
function verifyGenesisBlock(block) {
    const blockWithoutHash = lodash_1.default.omit(block, ["hash"]);
    if (block.hash !== (0, utils_js_1.computeHash)(blockWithoutHash)) {
        throw new Error("Invalid block hash");
    }
}
exports.verifyGenesisBlock = verifyGenesisBlock;
function blockify(data) {
    return JSON.parse(JSON.stringify(data));
}
exports.blockify = blockify;
//# sourceMappingURL=block.js.map