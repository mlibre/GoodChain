# GoodChain POW

This project implements a simple `proof-of-work` blockchain in `JavaScript` using `Node.js`. It demonstrates core concepts like `mining`, `transactions`, `wallets` and `more`.

## Files

* blockchain.js - Contains the Blockchain class that manages the chain of blocks
* block.js - Block class represents each block in the blockchain
* wallet.js - Wallet class handles public/private keys and signing transactions
* transaction.js - Transaction class represents movement of coins between wallets
* utils.js - Utility functions for filesystem access, crypto hashes etc.
* example.js - Example usage of the blockchain, mining blocks and sending transactions

## Usage

```js
const Blockchain = require( "./library/chain" );
const Wallet = require( "./library/wallet" );
const { initJsonFile } = require( "./library/utils" )

const minerKeys = initJsonFile( "./keys/miner.json", Wallet.createKeyPair() );

const blockchain = new Blockchain( "./db/blockchain.json", "./db/wallets.json", "GoodChain", minerKeys );

console.log( blockchain.validateChain() );
console.log( "Latest Block :", blockchain.latestBlock );
console.log( "Wallets : ", blockchain.wallet );
```

The blockchain data is stored in `blockchain.json` and `wallet` data in `wallets.json`.

## REST API

A basic `Express.js` REST API is provided in restAPI folder. It exposes endpoints to get blockchain data, mine a new block and submit new transaction.

```js
npm start--port 3000 --host "localhost" --blockchainFile "../db/blockchain.json" --walletsFile "../db/wallets.json" --minerKeysFile "../keys/miner.json" --blockchainArg "GoodChain"

```
