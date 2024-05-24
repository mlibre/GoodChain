"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const router = express_1.default.Router();
const blockchain_js_1 = tslib_1.__importDefault(require("../blockchain.js"));
const axios_1 = tslib_1.__importDefault(require("axios"));
const utils_js_1 = require("../utils.js");
router.get("/", function (req, res) {
    res.send(blockchain_js_1.default.chain.all);
});
router.post("/update", async function (req, res) {
    let continueUpdate = true;
    while (continueUpdate) {
        const currentIndex = blockchain_js_1.default.chain.latestBlock.index;
        const nodesLatestBlocks = [];
        for (const node of blockchain_js_1.default.nodes.list) {
            try {
                const response = await axios_1.default.get(`${node}/block`, {
                    params: {
                        index: currentIndex + 1
                    }
                });
                blockchain_js_1.default.verifyCandidateBlock(response.data);
                nodesLatestBlocks.push(response.data);
            }
            catch (error) {
                (0, utils_js_1.axiosErrorHandling)(error, node);
            }
        }
        const chosenBlockResult = blockchain_js_1.default.consensus.chooseBlock(nodesLatestBlocks);
        if (chosenBlockResult) {
            blockchain_js_1.default.addBlock(chosenBlockResult);
        }
        else {
            continueUpdate = false;
        }
    }
    res.send(blockchain_js_1.default.chain.latestBlock);
});
router.put("/sync", async function (req, res) {
    const myLastestBlock = blockchain_js_1.default.chain.latestBlock;
    const otherNodesLastestBlocks = [];
    for (const node of blockchain_js_1.default.nodes.list) {
        try {
            const [firstBlock, lastBlock] = (await axios_1.default.get(`${node}/block`, { params: { firstAndLast: true } })).data;
            if ((0, utils_js_1.isEqualBlock)(firstBlock, blockchain_js_1.default.chain.genesisBlock) &&
                !(0, utils_js_1.isEqualBlock)(myLastestBlock, lastBlock)) {
                otherNodesLastestBlocks.push({ block: lastBlock, node });
            }
        }
        catch (error) {
            console.error(`Error fetching data from node ${node}:`, error);
        }
    }
    const allNodesLastBlocks = [
        ...otherNodesLastestBlocks,
        { block: blockchain_js_1.default.chain.latestBlock, node: blockchain_js_1.default.nodes.hostUrl }
    ];
    const chosenNodeBlock = blockchain_js_1.default.consensus.chooseChain(allNodesLastBlocks);
    if (chosenNodeBlock) {
        const chosenChain = await axios_1.default.get(`${chosenNodeBlock.node}/chain`);
        blockchain_js_1.default.replaceChain(chosenChain.data);
    }
    res.send("ok");
});
exports.default = router;
//# sourceMappingURL=chain.js.map