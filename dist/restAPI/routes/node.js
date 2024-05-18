import express from "express";
const router = express.Router();
import blockchain from "../blockchain";
import axios from "axios";
router.get("/", function (req, res) {
    res.send(blockchain.nodes.all);
});
router.post("/", function (req, res) {
    const result = blockchain.addNode(req.body.url);
    res.send(result);
});
router.post("/update", async function (req, res) {
    for (const node of blockchain.nodes.list) {
        try {
            const response = await axios.get(`${node}/nodes`);
            blockchain.nodes.addBulk(response.data);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error fetching data from node ${node}:`, error.message);
            }
            else {
                console.error(`Error fetching data from node ${node}:`, error);
            }
        }
    }
    res.send(blockchain.nodes.all);
});
router.get("/broadcast", async function (req, res) {
    for (const node of blockchain.nodes.list) {
        try {
            await axios.post(`${node}/nodes`, {
                url: blockchain.nodes.hostUrl
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error introducing self to node ${node}:`, error.message);
            }
            else {
                console.error(`Error introducing self to node ${node}:`, error);
            }
        }
    }
    res.send("Introduced self to all nodes");
});
export default router;
//# sourceMappingURL=node.js.map