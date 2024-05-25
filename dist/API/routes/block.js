import express from "express";
import axios from "axios";
import blockchain from "../blockchain.js";
import { toNum } from "../utils.js";
const router = express.Router();
router.get("/", (req, res) => {
    const { list, to, index, from, firstAndLast } = req.query;
    if (!index && !from && !to && !list && !firstAndLast) {
        res.json(blockchain.chain.latestBlock);
        return;
    }
    if (index) {
        res.json(blockchain.chain.get(toNum(index)));
        return;
    }
    if (from || to) {
        res.json(blockchain.getBlocks(toNum(from), toNum(to)));
        return;
    }
    if (list) {
        const blocks = list.toString().split(",").map((index) => {
            return blockchain.chain.get(toNum(index));
        });
        res.json(blocks);
        return;
    }
    if (firstAndLast) {
        res.json([blockchain.chain.get(0), blockchain.chain.latestBlock]);
        return;
    }
});
router.post("/", (req, res) => {
    const block = blockchain.addBlock(req.body);
    res.json(block);
});
router.get("/broadcast", async (req, res) => {
    for (const node of blockchain.nodes.list) {
        try {
            await axios.post(`${node}/block`, blockchain.chain.latestBlock);
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
export default router;
//# sourceMappingURL=block.js.map