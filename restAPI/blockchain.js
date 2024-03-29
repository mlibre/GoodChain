const Blockchain = require( "../library/main" );
const Consensus = require( "../library/pow-consensus" );
const consensus = new Consensus()
const { initJsonFile, createKeyPair } = require( "../library/utils" )
const { name, dbPath, minerKeysFile, hostUrl, nodesList } = require( "./config" );

const minerKeys = initJsonFile( minerKeysFile, createKeyPair() );
module.exports = new Blockchain({
	dbPath,
	nodes: {
		list: nodesList,
		hostUrl
	},
	chainName: name,
	minerKeys,
	consensus
});