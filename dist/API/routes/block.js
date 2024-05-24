"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const axios_1 = tslib_1.__importDefault(require("axios"));
const blockchain_js_1 = tslib_1.__importDefault(require("../blockchain.js"));
const utils_js_1 = require("../utils.js");
const router = express_1.default.Router();
router.get("/", function (req, res) {
    const { list } = req.query;
    const { to, index, from, firstAndLast } = req.query;
    if (!index && !from && !to && !list && !firstAndLast) {
        res.json(blockchain_js_1.default.chain.latestBlock);
        return;
    }
    else if (index) {
        const blockIndex = (0, utils_js_1.toNum)(index);
        res.json(blockchain_js_1.default.chain.get(blockIndex));
        return;
    }
    else if (from || to) {
        const blockFrom = (0, utils_js_1.toNum)(from);
        const blockTo = (0, utils_js_1.toNum)(to);
        const blocks = blockchain_js_1.default.getBlocks(blockFrom, blockTo);
        res.json(blocks);
        return;
    }
    else if (list) {
        const blockList = list.toString().split(",");
        const blocks = [];
        for (const blcokIndex of blockList) {
            blocks.push(blockchain_js_1.default.chain.get(blcokIndex));
        }
        res.json(blocks);
        return;
    }
    else if (firstAndLast) {
        const blocks = [];
        blocks.push(blockchain_js_1.default.chain.get(0));
        blocks.push(blockchain_js_1.default.chain.latestBlock);
        res.json(blocks);
        return;
    }
});
router.post("/", function (req, res) {
    const block = blockchain_js_1.default.addBlock(req.body);
    res.send(block);
});
router.get("/broadcast", async function (req, res) {
    for (const node of blockchain_js_1.default.nodes.list) {
        try {
            await axios_1.default.post(`${node}/block`, blockchain_js_1.default.chain.latestBlock);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error broadcasting to node ${node}:`, error.message);
            }
            else {
                console.error(`Error broadcasting to node ${node}`, error);
            }
        }
    }
    res.send("Broadcasted to all nodes");
});
exports.default = router;
//# sourceMappingURL=block.js.map