import { parseUrl } from "./utils.js";
import parseArgs from "minimist";
// Parse command line arguments
const args = parseArgs(process.argv.slice(2));
// Define default values or fallbacks
const hostUrl = args.host || process.env.HOST || "http://127.0.0.1:3000";
const { host: hostAddress, port: hostPort } = parseUrl(hostUrl);
let nodesList = args.nodes || process.env.NODES || "http://127.0.0.1:3001";
nodesList = Array.isArray(nodesList) ? nodesList : [nodesList];
const dbPath = args.dbPath || process.env.BLOCKCHAIN_FILE || "./assets/db/";
const minerKeysFile = args.minerKeysFile || process.env.MINER_KEYS_FILE || "./assets/keys/miner.json";
const name = args.name || process.env.BLOCKCHAIN_NAME || "GoodChain";
export { hostUrl, hostAddress, hostPort, nodesList, dbPath, minerKeysFile, name };
//# sourceMappingURL=config.js.map