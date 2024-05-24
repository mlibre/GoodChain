"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const path_1 = tslib_1.__importDefault(require("path"));
const Block = tslib_1.__importStar(require("./block.js"));
const utils_js_1 = require("./utils.js");
class ChainStore {
    folderPath;
    constructor(folderPath) {
        this.folderPath = (0, utils_js_1.generateFilePath)(folderPath, "chain");
        (0, utils_js_1.createFolder)(this.folderPath);
    }
    get length() {
        return fs_1.default.readdirSync(this.folderPath).length;
    }
    get all() {
        const fileNames = fs_1.default.readdirSync(this.folderPath).sort();
        const blocks = [];
        for (const fileName of fileNames) {
            const filePath = path_1.default.join(this.folderPath, fileName);
            const block = JSON.parse(fs_1.default.readFileSync(filePath, "utf8"));
            blocks.push(block);
        }
        return blocks;
    }
    get(blockNumber) {
        const blockIndex = parseInt(blockNumber.toString());
        if (blockIndex >= this.length || blockIndex < 0) {
            throw new Error("Invalid block number");
        }
        return JSON.parse(fs_1.default.readFileSync(`${this.blockFilePath(blockNumber)}.json`, "utf8"));
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
        const files = fs_1.default.readdirSync(this.folderPath);
        const lastFile = files.sort().pop();
        if (!lastFile) {
            throw new Error("No blocks found");
        }
        return JSON.parse(fs_1.default.readFileSync(this.blockFilePath(lastFile), "utf8"));
    }
    push(block) {
        fs_1.default.writeFileSync(`${this.blockFilePath(block.index)}.json`, JSON.stringify(block, null, "\t"));
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
        return path_1.default.join(this.folderPath, index.toString());
    }
    checkFinalDBState(proposedBlock) {
        if (proposedBlock.index === 0) {
            const lastBlock = this.latestBlock;
            Block.verifyGenesisBlock(lastBlock);
            if (!lodash_1.default.isEqual(lastBlock, proposedBlock)) {
                throw new Error("Invalid chain");
            }
            return true;
        }
        const [lastBlock, secondLastBlock] = [this.get(proposedBlock.index), this.get(proposedBlock.index - 1)];
        Block.verifyBlock(lastBlock, secondLastBlock);
        if (!lodash_1.default.isEqual(lastBlock, proposedBlock)) {
            throw new Error("Invalid chain");
        }
        const [lastBlockFile, secondLastBlockFile] = this.lastTwoBlocks();
        if (!lodash_1.default.isEqual(lastBlockFile, lastBlock) || !lodash_1.default.isEqual(secondLastBlockFile, secondLastBlock)) {
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
exports.default = ChainStore;
//# sourceMappingURL=chain.js.map