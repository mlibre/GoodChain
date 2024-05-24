"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const utils_js_1 = require("../library/utils.js");
const wallet_js_1 = tslib_1.__importDefault(require("../library/wallet.js"));
(0, utils_js_1.deleteFolder)("./assets/keys/");
(0, utils_js_1.initJsonFile)("./assets/keys/user.json", wallet_js_1.default.generateKeyPair());
(0, utils_js_1.initJsonFile)("./assets/keys/miner.json", wallet_js_1.default.generateKeyPair());
//# sourceMappingURL=generateKeys.js.map