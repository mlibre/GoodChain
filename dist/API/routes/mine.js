import express from "express";
const router = express.Router();
import blockchain from "../blockchain.js";
router.get("/", function (req, res) {
    const block = blockchain.mineNewBlock();
    res.send(block);
});
export default router;
//# sourceMappingURL=mine.js.map