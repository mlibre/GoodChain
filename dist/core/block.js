import _ from "lodash";
import Transaction from "./transaction.js";
import { computeHash } from "./utils.js";
export function verifyBlock(currentBlock, previousBlock) {
    const blockWithoutHash = _.omit(currentBlock, ["hash"]);
    if (currentBlock.hash !== computeHash(blockWithoutHash)) {
        throw new Error("Invalid block hash");
    }
    if (currentBlock.chainName !== previousBlock.chainName) {
        throw new Error("Invalid chain name");
    }
    if (currentBlock.index !== previousBlock.index + 1) {
        throw new Error("Invalid index");
    }
    if (currentBlock.previousHash !== previousBlock.hash) {
        throw new Error("Invalid previous hash");
    }
    if (currentBlock.timestamp < previousBlock.timestamp) {
        throw new Error("Block timestamp must be greater than previous block timestamp");
    }
    for (const transaction of currentBlock.transactions) {
        const transactionInstance = new Transaction(transaction);
        transactionInstance.validate();
    }
}
export function verifyGenesisBlock(block) {
    const blockWithoutHash = _.omit(block, ["hash"]);
    if (block.hash !== computeHash(blockWithoutHash)) {
        throw new Error("Invalid block hash");
    }
    if (block.index !== 0) {
        throw new Error("Invalid index");
    }
    if (block.previousHash !== "") {
        throw new Error("Invalid previous hash");
    }
}
export function cloneBlock(data) {
    return JSON.parse(JSON.stringify(data));
}
//# sourceMappingURL=block.js.map