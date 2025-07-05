import express from "express";
const router = express.Router();
import blockchain from "../blockchain.js";
router.get("/", async function (req, res) {
    const block = await blockchain.mineNewBlock();
    res.send(block);
});
export default router;
//# sourceMappingURL=mine.js.map