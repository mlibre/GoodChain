"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const utils_js_1 = require("./utils.js");
class POW {
    name;
    difficulty;
    minDifficulty;
    constructor() {
        this.name = "pow";
        this.difficulty = "000fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
        this.minDifficulty = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
    }
    setValues(block) {
        if (block.consensusDifficulty) {
            this.difficulty = block.consensusDifficulty.toString();
        }
    }
    apply(block, previousBlock) {
        let targetDifficulty;
        block.consensusName = this.name;
        if (block.index === 0) {
            block.consensusDifficulty = this.difficulty;
            block.consensusTotalDifficulty = "0";
            targetDifficulty = this.difficulty;
        }
        else {
            block.consensusDifficulty = previousBlock.consensusDifficulty;
            const num1 = parseInt(this.minDifficulty, 16) - parseInt(previousBlock.consensusHash.toString(), 16);
            const num2 = parseInt(previousBlock.consensusTotalDifficulty.toString(), 16);
            const sum = num1 + num2;
            const sumHex = sum.toString(16);
            block.consensusTotalDifficulty = sumHex;
            targetDifficulty = previousBlock.consensusDifficulty.toString();
        }
        block.consensusNonce = 0;
        let hash = (0, utils_js_1.computeHash)(block);
        while (hash.localeCompare(targetDifficulty) != -1) {
            block.consensusNonce++;
            hash = (0, utils_js_1.computeHash)(block);
        }
        block.consensusHash = hash;
        return block;
    }
    applyGenesis(block) {
        block.consensusName = this.name;
        block.consensusDifficulty = this.difficulty;
        block.consensusTotalDifficulty = "0";
        block.consensusNonce = 0;
        let hash = (0, utils_js_1.computeHash)(block);
        while (hash.localeCompare(this.difficulty) != -1) {
            block.consensusNonce++;
            hash = (0, utils_js_1.computeHash)(block);
        }
        block.consensusHash = hash;
        return block;
    }
    validate(block, previousBlock) {
        const pureObject = lodash_1.default.omit(block, ["consensusHash", "hash"]);
        const hash = (0, utils_js_1.computeHash)(pureObject);
        if (block.consensusHash.toString().localeCompare(hash) !== 0) {
            throw new Error("Invalid hash");
        }
        if (block.consensusName !== previousBlock.consensusName) {
            throw new Error("Invalid consensus name");
        }
        if (block.consensusDifficulty !== previousBlock.consensusDifficulty) {
            throw new Error("Invalid difficulty");
        }
    }
    validateGenesis(block) {
        const pureObject = lodash_1.default.omit(block, ["consensusHash", "hash"]);
        const hash = (0, utils_js_1.computeHash)(pureObject);
        if (block.consensusHash.toString().localeCompare(hash) !== 0) {
            throw new Error("Invalid hash");
        }
    }
    chooseBlock(blocks) {
        return lodash_1.default.maxBy(blocks, (block) => {
            const blockDifficulty = parseInt(this.minDifficulty, 16) - parseInt(block.consensusHash.toString(), 16);
            return parseInt(block.consensusTotalDifficulty.toString(), 16) + blockDifficulty;
        });
    }
    chooseChain(nodesBlocks) {
        return lodash_1.default.maxBy(nodesBlocks, (nodeBlock) => {
            const { block } = nodeBlock;
            const blockDifficulty = parseInt(this.minDifficulty, 16) - parseInt(block.consensusHash.toString(), 16);
            return parseInt(block.consensusTotalDifficulty.toString(), 16) + blockDifficulty;
        });
    }
}
exports.default = POW;
//# sourceMappingURL=pow-consensus.js.map