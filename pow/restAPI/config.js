// config.js

const parseArgs = require( "minimist" );

// Parse command line arguments
const args = parseArgs( process.argv.slice( 2 ) );

// Define default values or fallbacks
const port = args.port || process.env.PORT || 3000;
const host = args.host || process.env.HOST || "127.0.0.1";
const protocol = args.protocol || process.env.PROTOCOL || "http";
const blockchainFile = args.blockchainFile || process.env.BLOCKCHAIN_FILE || "./db/blockchain.json";
const walletsFile = args.walletsFile || process.env.WALLETS_FILE || "./db/wallets.json";
const blockchainName = args.blockchainName || process.env.BLOCKCHAIN_NAME || "GoodChain";
const minerKeysFile = args.minerKeysFile || process.env.MINER_KEYS_FILE || "./keys/miner.json";

module.exports = {
	port,
	host,
	protocol,
	blockchainFile,
	walletsFile,
	minerKeysFile,
	blockchainName
};
