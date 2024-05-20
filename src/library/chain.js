"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var lodash_1 = require("lodash");
var path_1 = require("path");
var Block = require("./block.js");
var utils_js_1 = require("./utils.js");
var ChainStore = /** @class */ (function () {
    function ChainStore(folderPath) {
        this.folderPath = (0, utils_js_1.makeFilePath)(folderPath, "chain");
        (0, utils_js_1.createFolder)(this.folderPath);
    }
    Object.defineProperty(ChainStore.prototype, "length", {
        get: function () {
            return fs_1.default.readdirSync(this.folderPath).length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChainStore.prototype, "all", {
        get: function () {
            var fileNames = fs_1.default.readdirSync(this.folderPath).sort();
            var blocks = [];
            for (var _i = 0, fileNames_1 = fileNames; _i < fileNames_1.length; _i++) {
                var fileName = fileNames_1[_i];
                var filePath = path_1.default.join(this.folderPath, fileName);
                var block = JSON.parse(fs_1.default.readFileSync(filePath, "utf8"));
                blocks.push(block);
            }
            return blocks;
        },
        enumerable: false,
        configurable: true
    });
    ChainStore.prototype.get = function (blockNumber) {
        var blockIndex = parseInt(blockNumber.toString());
        if (blockIndex >= this.length || blockIndex < 0) {
            throw new Error("Invalid block number");
        }
        return JSON.parse(fs_1.default.readFileSync("".concat(this.blockFilePath(blockNumber), ".json"), "utf8"));
    };
    ChainStore.prototype.getRange = function (from, to) {
        var blocks = [];
        to = to !== null && to !== void 0 ? to : this.length - 1;
        for (var i = from; i <= to; i++) {
            blocks.push(this.get(i));
        }
        return blocks;
    };
    Object.defineProperty(ChainStore.prototype, "genesisBlock", {
        get: function () {
            return this.get(0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChainStore.prototype, "latestBlock", {
        get: function () {
            var files = fs_1.default.readdirSync(this.folderPath);
            var lastFile = files.sort().pop();
            if (!lastFile) {
                throw new Error("No blocks found");
            }
            return JSON.parse(fs_1.default.readFileSync(this.blockFilePath(lastFile), "utf8"));
        },
        enumerable: false,
        configurable: true
    });
    ChainStore.prototype.push = function (block) {
        fs_1.default.writeFileSync("".concat(this.blockFilePath(block.index), ".json"), JSON.stringify(block, null, "\t"));
    };
    ChainStore.prototype.replaceBlocks = function (blocks) {
        for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
            var block = blocks_1[_i];
            this.push(block);
        }
    };
    ChainStore.prototype.lastTwoBlocks = function () {
        var lastBlock = this.latestBlock;
        var secondLastBlock = this.get(lastBlock.index - 1);
        return [lastBlock, secondLastBlock];
    };
    ChainStore.prototype.blockFilePath = function (index) {
        return path_1.default.join(this.folderPath, index.toString());
    };
    ChainStore.prototype.checkFinalDBState = function (proposedBlock) {
        if (proposedBlock.index === 0) {
            var lastBlock_1 = this.latestBlock;
            Block.verifyGenesis(lastBlock_1);
            if (!lodash_1.default.isEqual(lastBlock_1, proposedBlock)) {
                throw new Error("Invalid chain");
            }
            return true;
        }
        var _a = [this.get(proposedBlock.index), this.get(proposedBlock.index - 1)], lastBlock = _a[0], secondLastBlock = _a[1];
        Block.verifyBlock(lastBlock, secondLastBlock);
        if (!lodash_1.default.isEqual(lastBlock, proposedBlock)) {
            throw new Error("Invalid chain");
        }
        var _b = this.lastTwoBlocks(), lastBlockFile = _b[0], secondLastBlockFile = _b[1];
        if (!lodash_1.default.isEqual(lastBlockFile, lastBlock) || !lodash_1.default.isEqual(secondLastBlockFile, secondLastBlock)) {
            throw new Error("Invalid chain");
        }
        return true;
    };
    ChainStore.prototype.validateChain = function () {
        if (this.length === 0) {
            return true;
        }
        for (var i = 0; i < this.length; i++) {
            if (i === 0) {
                Block.verifyGenesis(this.get(i));
            }
            else {
                Block.verifyBlock(this.get(i), this.get(i - 1));
            }
        }
        return true;
    };
    return ChainStore;
}());
exports.default = ChainStore;
