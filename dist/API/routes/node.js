"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const router = express_1.default.Router();
const blockchain_js_1 = tslib_1.__importDefault(require("../blockchain.js"));
const axios_1 = tslib_1.__importDefault(require("axios"));
router.get("/", function (req, res) {
    res.send(blockchain_js_1.default.nodes.all);
});
router.post("/", function (req, res) {
    const result = blockchain_js_1.default.addNode(req.body.url);
    res.send(result);
});
router.post("/update", async function (req, res) {
    for (const node of blockchain_js_1.default.nodes.list) {
        try {
            const response = await axios_1.default.get(`${node}/nodes`);
            blockchain_js_1.default.nodes.addBulk(response.data);
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
    res.send(blockchain_js_1.default.nodes.all);
});
router.get("/broadcast", async function (req, res) {
    for (const node of blockchain_js_1.default.nodes.list) {
        try {
            await axios_1.default.post(`${node}/nodes`, {
                url: blockchain_js_1.default.nodes.hostUrl
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
exports.default = router;
//# sourceMappingURL=node.js.map