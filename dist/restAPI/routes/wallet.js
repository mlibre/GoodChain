import express from "express";
const router = express.Router();
import blockchain from "../blockchain";
router.get("/", function (req, res) {
    res.send(blockchain.wallet.allData);
});
export default router;
//# sourceMappingURL=wallet.js.map