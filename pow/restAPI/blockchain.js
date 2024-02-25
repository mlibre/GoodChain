const Blockchain = require( "../library/chain" );
const Consensus = require( "../library/pow-consensus" );
const consensus = new Consensus()
const { initJsonFile, createKeyPair } = require( "../library/utils" )
const { blockchainName, blockchainFile, walletsFile, minerKeysFile, url, nodesList, nodesFile } = require( "./config" );

const minerKeys = initJsonFile( minerKeysFile, createKeyPair() );
module.exports = new Blockchain({
	chainFilePath: blockchainFile,
	walletFilePath: walletsFile,
	nodes: {
		filePath: nodesFile,
		list: nodesList,
		hostUrl: url
	},
	chainName: blockchainName,
	minerKeys,
	consensus
});