const path = require( "path" );
const Blockchain = require( "../library/chain" );
const Wallet = mrequire( "../library/wallet" );
const { initJsonFile } = mrequire( "../library/utils" )

const minerKeys = initJsonFile( rPath( "../keys/miner.json" ), Wallet.createKeyPair() );

module.exports = new Blockchain(
	rPath( "../db/blockchain.json" ),
	rPath( "../db/wallets.json" ),
	"GoodChain",
	minerKeys
);

function mrequire ( requirePath )
{
	return require( path.join( __dirname, requirePath ) );
}
function rPath ( rpath )
{
	return path.join( __dirname, rpath );
}