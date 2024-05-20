"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var main_js_1 = require("../library/main.js");
var pow_consensus_js_1 = require("../library/pow-consensus.js");
var transactions_js_1 = require("../library/transactions.js");
var utils_js_1 = require("../library/utils.js");
(0, utils_js_1.deleteFolder)("assets/db/");
(0, utils_js_1.deleteFile)("./assets/keys/miner.json");
(0, utils_js_1.deleteFile)("./assets/keys/user.json");
var userKeys = (0, utils_js_1.initJsonFile)("./assets/keys/user.json", (0, utils_js_1.createKeyPair)());
var minerKeys = (0, utils_js_1.initJsonFile)("./assets/keys/miner.json", (0, utils_js_1.createKeyPair)());
var blockchain = new main_js_1.default({
    dbPath: "./assets/db/",
    nodes: {
        list: ["http://127.0.0.1:3001"],
        hostUrl: "http://127.0.0.1:3000"
    },
    chainName: "GoodChain",
    minerKeys: minerKeys,
    consensus: new pow_consensus_js_1.default()
});
blockchain.mineNewBlock();
var trx = new transactions_js_1.default({
    from: minerKeys.publicKey,
    to: userKeys.publicKey,
    amount: 50,
    fee: 0,
    transaction_number: 1
});
trx.sign(minerKeys.privateKey);
var blockNumber = blockchain.addTransaction(trx.data);
blockchain.mineNewBlock();
console.log("Mined block :", blockNumber, blockchain.chain.latestBlock);
var trx2 = new transactions_js_1.default({
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
