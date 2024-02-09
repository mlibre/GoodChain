const Blockchain = require( "./library/chain" );
const { initJsonFile, createKeyPair } = require( "./library/utils" )

const minerKeys = initJsonFile( "./keys/miner.json", createKeyPair() );

const blockchain = new Blockchain( "./db/blockchain.json", "./db/wallets.json", "GoodChain", minerKeys );

console.log( blockchain.validateChain() );
console.log( "Latest Block :", blockchain.latestBlock );
console.log( "Wallets : ", blockchain.wallet );
