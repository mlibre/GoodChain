import fs from "fs";
import _ from "lodash";
import path from "path";
import * as Block from "./block.js";
import { createFolder, generateFilePath } from "./utils.js";
export default class ChainStore {
    folderPath;
    constructor(folderPath) {
        this.folderPath = generateFilePath(folderPath, "chain");
        createFolder(this.folderPath);
    }
    get length() {
        return fs.readdirSync(this.folderPath).length;
    }
    get all() {
        const fileNames = fs.readdirSync(this.folderPath).sort();
        const blocks = [];
        for (const fileName of fileNames) {
            const filePath = path.join(this.folderPath, fileName);
            const block = JSON.parse(fs.readFileSync(filePath, "utf8"));
            blocks.push(block);
        }
        return blocks;
    }
    get(blockNumber) {
        const blockIndex = parseInt(blockNumber.toString());
        if (blockIndex >= this.length || blockIndex < 0) {
            throw new Error("Invalid block number");
        }
        return JSON.parse(fs.readFileSync(`${this.blockFilePath(blockNumber)}.json`, "utf8"));
    }
    getRange(from, to) {
        const blocks = [];
        to = to ?? this.length - 1;
        for (let i = from; i <= to; i++) {
            blocks.push(this.get(i));
        }
        return blocks;
    }
    get genesisBlock() {
        return this.get(0);
    }
    get latestBlock() {
        const files = fs.readdirSync(this.folderPath);
        const lastFile = files.sort().pop();
        if (!lastFile) {
            throw new Error("No blocks found");
        }
        return JSON.parse(fs.readFileSync(this.blockFilePath(lastFile), "utf8"));
    }
    push(block) {
        fs.writeFileSync(`${this.blockFilePath(block.index)}.json`, JSON.stringify(block, null, "\t"));
    }
    replaceBlocks(blocks) {
        for (const block of blocks) {
            this.push(block);
        }
    }
    lastTwoBlocks() {
        const lastBlock = this.latestBlock;
        const secondLastBlock = this.get(lastBlock.index - 1);
        return [lastBlock, secondLastBlock];
    }
    blockFilePath(index) {
        return path.join(this.folderPath, index.toString());
    }
    checkFinalDBState(proposedBlock) {
        if (proposedBlock.index === 0) {
            const lastBlock = this.latestBlock;
            Block.verifyGenesisBlock(lastBlock);
            if (!_.isEqual(lastBlock, proposedBlock)) {
                throw new Error("Invalid chain");
            }
            return true;
        }
        const [lastBlock, secondLastBlock] = [this.get(proposedBlock.index), this.get(proposedBlock.index - 1)];
        Block.verifyBlock(lastBlock, secondLastBlock);
        if (!_.isEqual(lastBlock, proposedBlock)) {
            throw new Error("Invalid chain");
        }
        const [lastBlockFile, secondLastBlockFile] = this.lastTwoBlocks();
        if (!_.isEqual(lastBlockFile, lastBlock) || !_.isEqual(secondLastBlockFile, secondLastBlock)) {
            throw new Error("Invalid chain");
        }
        return true;
    }
    validateChain() {
        if (this.length === 0) {
            return true;
        }
        for (let i = 0; i < this.length; i++) {
            if (i === 0) {
                Block.verifyGenesisBlock(this.get(i));
            }
            else {
                Block.verifyBlock(this.get(i), this.get(i - 1));
            }
        }
        return true;
    }
}
//# sourceMappingURL=chain.js.map