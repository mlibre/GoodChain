const path = require( "path" );
const { blockchainName, blockchainFile, walletsFile, minerKeysFile } = require( "./config" );

const Blockchain = require( "../library/chain" );
const Wallet = require( "../library/wallet" );
const { initJsonFile } = require( "../library/utils" )

const minerKeys = initJsonFile( rPath( minerKeysFile ), Wallet.createKeyPair() );

module.exports = new Blockchain(
	rPath( blockchainFile ),
	rPath( walletsFile ),
	blockchainName,
	minerKeys
);

function rPath ( rpath )
{
	return path.join( __dirname, rpath );
}