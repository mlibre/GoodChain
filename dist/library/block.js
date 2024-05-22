import _ from "lodash";
import Transaction from "./transactions.js";
import { computeHash } from "./utils.js";
export function verifyBlock(block, previousBlock) {
    const normalizedBlock = _.omit(block, ["hash"]);
    if (block.hash !== computeHash(normalizedBlock)) {
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
    for (const transaction of block.transactions) {
        const transactionInstance = new Transaction(transaction);
        transactionInstance.validate();
    }
}
export function verifyGenesisBlock(block) {
    const normalizedBlock = _.omit(block, ["hash"]);
    if (block.hash !== computeHash(normalizedBlock)) {
        throw new Error("Invalid block hash");
    }
}
export function blockify(data) {
    return JSON.parse(JSON.stringify(data));
}
//# sourceMappingURL=block.js.map