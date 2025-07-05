import express from "express";
const router = express.Router();
import blockchain from "../blockchain.js";
router.get("/", async function (req, res) {
    res.send(await blockchain.wallet.allWallets());
});
export default router;
//# sourceMappingURL=wallet.js.map