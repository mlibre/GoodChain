"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.name = exports.minerKeysFile = exports.dbPath = exports.nodesList = exports.hostPort = exports.hostAddress = exports.hostUrl = void 0;
const tslib_1 = require("tslib");
const utils_js_1 = require("./utils.js");
const minimist_1 = tslib_1.__importDefault(require("minimist"));
// Parse command line arguments
const args = (0, minimist_1.default)(process.argv.slice(2));
// Define default values or fallbacks
const hostUrl = args.host || process.env.HOST || "http://127.0.0.1:3000";
exports.hostUrl = hostUrl;
const { host: hostAddress, port: hostPort } = (0, utils_js_1.parseUrl)(hostUrl);
exports.hostAddress = hostAddress;
exports.hostPort = hostPort;
let nodesList = args.nodes || process.env.NODES || "http://127.0.0.1:3001";
exports.nodesList = nodesList;
exports.nodesList = nodesList = Array.isArray(nodesList) ? nodesList : [nodesList];
const dbPath = args.dbPath || process.env.BLOCKCHAIN_FILE || "./assets/db/";
exports.dbPath = dbPath;
const minerKeysFile = args.minerKeysFile || process.env.MINER_KEYS_FILE || "./assets/keys/miner.json";
exports.minerKeysFile = minerKeysFile;
const name = args.name || process.env.BLOCKCHAIN_NAME || "GoodChain";
exports.name = name;
//# sourceMappingURL=config.js.map