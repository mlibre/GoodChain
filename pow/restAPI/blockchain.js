const { blockchainName, blockchainFile, walletsFile, minerKeysFile } = require( "./config" );

const Blockchain = require( "../library/chain" );
const Consensus = require( "../library/pow-consensus" );
const consensus = new Consensus()
const { initJsonFile, createKeyPair } = require( "../library/utils" )

const minerKeys = initJsonFile( minerKeysFile, createKeyPair() );
module.exports = new Blockchain({
	chainFilePath: blockchainFile,
	walletFilePath: walletsFile,
	chainName: blockchainName,
	minerKeys,
	consensus
});