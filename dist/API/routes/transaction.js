"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const router = express_1.default.Router();
const blockchain_js_1 = tslib_1.__importDefault(require("../blockchain.js"));
const transaction_js_1 = tslib_1.__importDefault(require("../../library/transaction.js"));
const axios_1 = tslib_1.__importDefault(require("axios"));
router.get("/", function (req, res) {
    res.json(blockchain_js_1.default.transactionPool);
});
router.post("/", function (req, res) {
    const blockNumber = blockchain_js_1.default.addTransaction(req.body);
    res.send(blockNumber.toString());
});
router.get("/update", async function (req, res) {
    try {
        for (const node of blockchain_js_1.default.nodes.list) {
            const response = await axios_1.default.get(`${node}/transaction`);
            blockchain_js_1.default.addTransactions(response.data);
        }
    }
    catch (error) {
        console.error(error);
    }
    res.json(blockchain_js_1.default.transactionPool);
});
router.post("/sign", function (req, res) {
    const transaction = new transaction_js_1.default(req.body);
    transaction.sign(req.body.privateKey);
    res.send(transaction.data);
});
exports.default = router;
//# sourceMappingURL=transaction.js.map