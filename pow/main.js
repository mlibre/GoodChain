const Blockchain = require( "./library/chain" );
const Wallet = require( "./library/wallet" );
const { initJsonFile } = require( "./library/utils" )

const minerKeys = initJsonFile( "./keys/miner.json", Wallet.createKeyPair() );

const blockchain = new Blockchain( "./db/blockchain.json", "./db/wallets.json", minerKeys );

console.log( blockchain.validateChain() );
console.log( "Latest Block :", blockchain.latestBlock );
console.log( "Wallets : ", blockchain.wallet );
