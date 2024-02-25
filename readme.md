# GoodChain

GoodChain is a lightweight, extensible blockchain project designed for **simplicity** and **flexibility**. It features a basic `proof-of-work (PoW)` consensus with plans for **plug-and-play** consensus mechanisms like Proof of Stake (PoS)

## Key Features

- **PoW Consensus**: Simple PoW implementation with plans for customizable consensus mechanisms
- **Wallet Management:** Efficiently manage digital wallets, track balances, and handle transactions
Key Pair Generation: Easily create key pairs for transaction signing and verification
- **RESTful API:** Integrate with external systems through a RESTful API, enabling seamless interaction with the blockchain

## Installation

To get started with GoodChain, clone the repository and install the necessary dependencies:

```bash
git clone https://github.com/mlibre/GoodChain.git
cd GoodChain
npm install
npm start
```

## Example

```javascript
const Blockchain = require( "../library/chain" );
const Transaction = require( "../library/transactions" )
const Consensus = require( "../library/pow-consensus" );
const consensus = new Consensus()

const { deleteFile, initJsonFile, createKeyPair } = require( "../library/utils" )
deleteFile( "./db/blockchain.json" );
deleteFile( "./db/wallets.json" );
deleteFile( "./db/nodes.json" );
deleteFile( "./keys/miner.json" );
deleteFile( "./keys/user.json" );

const userKeys = initJsonFile( "./keys/user.json", createKeyPair() );
const minerKeys = initJsonFile( "./keys/miner.json", createKeyPair() );
const blockchain = new Blockchain({
 chainFilePath: "./db/blockchain.json",
 walletFilePath: "./db/wallets.json",
 nodes: {
  filePath: "./db/nodes.json",
  list: [ "http://127.0.0.1:3001" ],
  hostUrl: "http://127.0.0.1:3000"
 },
 chainName: "GoodChain",
 minerKeys,
 consensus
});
blockchain.mineNewBlock();
```

```js
node test/example.js
```

## RESTful API

`GoodChain` provides a **RESTful API** for interacting with the blockchain. Some example endpoints include:

- **Add Node** `/nodes`
- **Get Node List** `/nodes`
- **Add Transaction** `/transaction`
- **Get Chain** `/chain`
- **Get Transactions Pool** `/transaction`
- **Get Wallet** `/wallet`
- **Mine Block** `/mine`
- **Signing Transaction** `/transaction/sign`
- **Update Transactions Pool** `/transaction/update`
- ...

### Run RESTful API

```bash
npm start -- --url "http://localhost:3000" --nodes "http://localhost:3001" --blockchainFile "./db/blockchain.json" --walletsFile "./db/wallets.json" --minerKeysFile "./keys/miner.json" --blockchainName "GoodChain" --nodes "http://localhost:3001"
```

## License

This project is licensed under the `GPL` License

## Donate :heartpulse:

ETH:
> 0xc9b64496986E7b6D4A68fDF69eF132A35e91838e
