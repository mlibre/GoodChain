const path = require( "path" );
const Blockchain = require( "../library/chain" );
const Wallet = require( "../library/wallet" );
const { initJsonFile } = require( "../library/utils" )

const minerKeys = initJsonFile( rPath( "../keys/miner.json" ), Wallet.createKeyPair() );

module.exports = new Blockchain(
	rPath( "../db/blockchain.json" ),
	rPath( "../db/wallets.json" ),
	"GoodChain",
	minerKeys
);

function rPath ( rpath )
{
	return path.join( __dirname, rpath );
}