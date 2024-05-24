"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const main_js_1 = tslib_1.__importDefault(require("../library/main.js"));
const pow_consensus_js_1 = tslib_1.__importDefault(require("../library/pow-consensus.js"));
const transaction_js_1 = tslib_1.__importDefault(require("../library/transaction.js"));
const utils_js_1 = require("../library/utils.js");
const wallet_js_1 = tslib_1.__importDefault(require("../library/wallet.js"));
(0, utils_js_1.deleteFolder)("assets/db/");
(0, utils_js_1.deleteFile)("./assets/keys/miner.json");
(0, utils_js_1.deleteFile)("./assets/keys/user.json");
const userKeys = (0, utils_js_1.initJsonFile)("./assets/keys/user.json", wallet_js_1.default.generateKeyPair());
const minerKeys = (0, utils_js_1.initJsonFile)("./assets/keys/miner.json", wallet_js_1.default.generateKeyPair());
const blockchain = new main_js_1.default({
    dbPath: "./assets/db/",
    nodes: {
        list: ["http://127.0.0.1:3001"],
        hostUrl: "http://127.0.0.1:3000"
    },
    chainName: "GoodChain",
    minerPublicKey: minerKeys.publicKey,
    consensus: new pow_consensus_js_1.default()
});
blockchain.mineNewBlock();
const trx = new transaction_js_1.default({
    from: minerKeys.publicKey,
    to: userKeys.publicKey,
    amount: 50,
    fee: 0,
    transaction_number: 1
});
trx.sign(minerKeys.privateKey);
const blockNumber = blockchain.addTransaction(trx.data);
blockchain.mineNewBlock();
console.log("Mined block :", blockNumber, blockchain.chain.latestBlock);
const trx2 = new transaction_js_1.default({
    from: userKeys.publicKey,
    to: "user3",
    amount: 5,
    fee: 0.3,
    transaction_number: 1
});
trx2.sign(userKeys.privateKey);
blockchain.addTransaction(trx2.data);
blockchain.mineNewBlock();
console.log("Latest Block :", blockchain.chain.latestBlock);
console.log("Wallets : ", blockchain.wallet);
console.log("chain validation:", blockchain.chain.validateChain());
//# sourceMappingURL=init.js.map