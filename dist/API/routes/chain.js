import express from "express";
const router = express.Router();
import blockchain from "../blockchain.js";
import axios from "axios";
import { isEqualBlock, axiosErrorHandling } from "../utils.js";
router.get("/", function (req, res) {
    res.send(blockchain.chain.all);
});
router.post("/update", async function (req, res) {
    let continueUpdate = true;
    while (continueUpdate) {
        const currentIndex = blockchain.chain.latestBlock.index;
        const nodesLatestBlocks = [];
        for (const node of blockchain.nodes.list) {
            try {
                const response = await axios.get(`${node}/block`, {
                    params: {
                        index: currentIndex + 1
                    }
                });
                blockchain.verifyCandidateBlock(response.data);
                nodesLatestBlocks.push(response.data);
            }
            catch (error) {
                axiosErrorHandling(error, node);
            }
        }
        const chosenBlockResult = blockchain.consensus.chooseBlock(nodesLatestBlocks);
        if (chosenBlockResult) {
            blockchain.addBlock(chosenBlockResult);
        }
        else {
            continueUpdate = false;
        }
    }
    res.send(blockchain.chain.latestBlock);
});
router.put("/sync", async function (req, res) {
    const myLastestBlock = blockchain.chain.latestBlock;
    const otherNodesLastestBlocks = [];
    for (const node of blockchain.nodes.list) {
        try {
            const [firstBlock, lastBlock] = (await axios.get(`${node}/block`, { params: { firstAndLast: true } })).data;
            if (isEqualBlock(firstBlock, blockchain.chain.genesisBlock) &&
                !isEqualBlock(myLastestBlock, lastBlock)) {
                otherNodesLastestBlocks.push({ block: lastBlock, node });
            }
        }
        catch (error) {
            console.error(`Error fetching data from node ${node}:`, error);
        }
    }
    const allNodesLastBlocks = [
        ...otherNodesLastestBlocks,
        { block: blockchain.chain.latestBlock, node: blockchain.nodes.hostUrl }
    ];
    const chosenNodeBlock = blockchain.consensus.chooseChain(allNodesLastBlocks);
    if (chosenNodeBlock) {
        const chosenChain = await axios.get(`${chosenNodeBlock.node}/chain`);
        blockchain.replaceChain(chosenChain.data);
    }
    res.send("ok");
});
export default router;
//# sourceMappingURL=chain.js.map