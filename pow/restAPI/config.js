// config.js

const parseArgs = require( "minimist" );

// Parse command line arguments
const args = parseArgs( process.argv.slice( 2 ) );

// Define default values or fallbacks
const url = args.url || process.env.url || "http://127.0.0.1:3000";
const { host, port } = parseUrl( url );
let nodes = args.nodes || process.env.NODES;
nodes = Array.isArray( nodes ) ? nodes : [ nodes ];
const blockchainFile = args.blockchainFile || process.env.BLOCKCHAIN_FILE || "./db/blockchain.json";
const walletsFile = args.walletsFile || process.env.WALLETS_FILE || "./db/wallets.json";
const minerKeysFile = args.minerKeysFile || process.env.MINER_KEYS_FILE || "./keys/miner.json";
const blockchainName = args.blockchainName || process.env.BLOCKCHAIN_NAME || "GoodChain";

module.exports = {
	url,
	host,
	port,
	nodes,
	blockchainFile,
	walletsFile,
	minerKeysFile,
	blockchainName
};

function parseUrl ( url )
{
	const urlObj = new URL( url );
	const protocol = urlObj.protocol.replace( ":", "" );
	const host = urlObj.hostname;
	const { port } = urlObj;
	return { host, port, protocol };
}