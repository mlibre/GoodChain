"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var utils_js_1 = require("./utils.js");
var pow = /** @class */ (function () {
    function pow() {
        this.name = "pow";
        this.difficulty = "000fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
        this.minDifficulty = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
    }
    pow.prototype.setValues = function (block) {
        if (block.consensusDifficulty) {
            this.difficulty = block.consensusDifficulty.toString();
        }
    };
    pow.prototype.apply = function (block, previousBlock) {
        var targetDifficulty;
        block.consensusName = this.name;
        if (block.index === 0) {
            block.consensusDifficulty = this.difficulty;
            block.consensusTotalDifficulty = "0";
            targetDifficulty = this.difficulty;
        }
        else {
            block.consensusDifficulty = previousBlock.consensusDifficulty;
            var num1 = parseInt(this.minDifficulty, 16) - parseInt(previousBlock.consensusHash.toString(), 16);
            var num2 = parseInt(previousBlock.consensusTotalDifficulty.toString(), 16);
            var sum = num1 + num2;
            var sumHex = sum.toString(16);
            block.consensusTotalDifficulty = sumHex;
            targetDifficulty = previousBlock.consensusDifficulty.toString();
        }
        block.consensusNonce = 0;
        var hash = (0, utils_js_1.hashDataObject)(block);
        while (hash.localeCompare(targetDifficulty) != -1) {
            block.consensusNonce++;
            hash = (0, utils_js_1.hashDataObject)(block);
        }
        block.consensusHash = hash;
        return block;
    };
    pow.prototype.applyGenesis = function (block) {
        block.consensusName = this.name;
        block.consensusDifficulty = this.difficulty;
        block.consensusTotalDifficulty = "0";
        block.consensusNonce = 0;
        var hash = (0, utils_js_1.hashDataObject)(block);
        while (hash.localeCompare(this.difficulty) != -1) {
            block.consensusNonce++;
            hash = (0, utils_js_1.hashDataObject)(block);
        }
        block.consensusHash = hash;
        return block;
    };
    pow.prototype.validate = function (block, previousBlock) {
        var pureObject = lodash_1.default.omit(block, ["consensusHash", "hash"]);
        var hash = (0, utils_js_1.hashDataObject)(pureObject);
        if (block.consensusHash.toString().localeCompare(hash) !== 0) {
            throw new Error("Invalid hash");
        }
        if (block.consensusName !== previousBlock.consensusName) {
            throw new Error("Invalid consensus name");
        }
        if (block.consensusDifficulty !== previousBlock.consensusDifficulty) {
            throw new Error("Invalid difficulty");
        }
    };
    pow.prototype.validateGenesis = function (block) {
        var pureObject = lodash_1.default.omit(block, ["consensusHash", "hash"]);
        var hash = (0, utils_js_1.hashDataObject)(pureObject);
        if (block.consensusHash.toString().localeCompare(hash) !== 0) {
            throw new Error("Invalid hash");
        }
    };
    pow.prototype.chooseBlock = function (blocks) {
        var _this = this;
        return lodash_1.default.maxBy(blocks, function (block) {
            var blockDifficulty = parseInt(_this.minDifficulty, 16) - parseInt(block.consensusHash.toString(), 16);
            return parseInt(block.consensusTotalDifficulty.toString(), 16) + blockDifficulty;
        });
    };
    pow.prototype.chooseChain = function (nodesBlocks) {
        var _this = this;
        return lodash_1.default.maxBy(nodesBlocks, function (nodeBlock) {
            var block = nodeBlock.block;
            var blockDifficulty = parseInt(_this.minDifficulty, 16) - parseInt(block.consensusHash.toString(), 16);
            return parseInt(block.consensusTotalDifficulty.toString(), 16) + blockDifficulty;
        });
    };
    return pow;
}());
exports.default = pow;
