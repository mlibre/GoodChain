"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const main_js_1 = tslib_1.__importDefault(require("../library/main.js"));
const pow_consensus_js_1 = tslib_1.__importDefault(require("../library/pow-consensus.js"));
const consensus = new pow_consensus_js_1.default();
const utils_js_1 = require("../library/utils.js");
const wallet_js_1 = tslib_1.__importDefault(require("../library/wallet.js"));
const config_js_1 = require("./config.js");
const minerKeys = (0, utils_js_1.initJsonFile)(config_js_1.minerKeysFile, wallet_js_1.default.generateKeyPair());
exports.default = new main_js_1.default({
    dbPath: config_js_1.dbPath,
    nodes: {
        list: config_js_1.nodesList,
        hostUrl: config_js_1.hostUrl
    },
    chainName: config_js_1.name,
    minerPublicKey: minerKeys.publicKey,
    consensus
});
//# sourceMappingURL=blockchain.js.map