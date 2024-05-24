"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const transaction_js_1 = tslib_1.__importDefault(require("../library/transaction.js"));
const utils_js_1 = require("../library/utils.js");
const minerKeys = (0, utils_js_1.initJsonFile)("./assets/keys/miner.json");
const userKeys = (0, utils_js_1.initJsonFile)("./assets/keys/user.json");
const trx = new transaction_js_1.default({
    from: minerKeys.publicKey,
    to: userKeys.publicKey,
    amount: 50,
    fee: 0,
    transaction_number: 1
});
trx.signature = trx.sign(minerKeys.privateKey);
console.log(JSON.stringify(trx.data));
//# sourceMappingURL=signTransaction.js.map