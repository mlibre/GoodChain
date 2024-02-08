// config.js

const parseArgs = require( "minimist" );

// Parse command line arguments
const args = parseArgs( process.argv.slice( 2 ) );

// Define default values or fallbacks
const url = args.url || process.env.url;
const blockchainFile = args.blockchainFile || process.env.BLOCKCHAIN_FILE || "./db/blockchain.json";
const walletsFile = args.walletsFile || process.env.WALLETS_FILE || "./db/wallets.json";
const blockchainName = args.blockchainName || process.env.BLOCKCHAIN_NAME || "GoodChain";
const minerKeysFile = args.minerKeysFile || process.env.MINER_KEYS_FILE || "./keys/miner.json";
const nodes = args.nodes || process.env.NODES;

module.exports = {
	url,
	blockchainFile,
	walletsFile,
	minerKeysFile,
	blockchainName,
	nodes
};
