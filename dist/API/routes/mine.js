"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const router = express_1.default.Router();
const blockchain_js_1 = tslib_1.__importDefault(require("../blockchain.js"));
router.get("/", function (req, res) {
    const block = blockchain_js_1.default.mineNewBlock();
    res.send(block);
});
exports.default = router;
//# sourceMappingURL=mine.js.map