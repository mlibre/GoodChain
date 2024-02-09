const { blockchainName, blockchainFile, walletsFile, minerKeysFile } = require( "./config" );

const Blockchain = require( "../library/chain" );
const { initJsonFile, createKeyPair } = require( "../library/utils" )

const minerKeys = initJsonFile( minerKeysFile, createKeyPair() );

module.exports = new Blockchain(
	blockchainFile,
	walletsFile,
	blockchainName,
	minerKeys
);