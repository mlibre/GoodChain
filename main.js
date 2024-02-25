const Blockchain = require( "./library/chain" );
const Consensus = require( "./library/pow-consensus" );
const consensus = new Consensus()
const { initJsonFile, createKeyPair } = require( "./library/utils" )

const minerKeys = initJsonFile( "./keys/miner.json", createKeyPair() );

const blockchain = new Blockchain({
	chainFilePath: "./db/blockchain.json",
	walletFilePath: "./db/wallets.json",
	chainName: "GoodChain",
	minerKeys,
	consensus
});

console.log( blockchain.validateChain() );
console.log( "Latest Block :", blockchain.latestBlock );
console.log( "Wallets : ", blockchain.wallet );
