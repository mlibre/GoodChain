const Blockchain = require( "../library/chain" );
const Wallet = require( "../library/wallet" );
const { initJsonFile } = require( "../library/utils" )

const minerKeys = initJsonFile( "../keys/miner.json", Wallet.createKeyPair() );

module.exports = new Blockchain( "../db/blockchain.json", "../db/wallets.json", minerKeys );
