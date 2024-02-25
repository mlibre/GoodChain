# GoodChain

GoodChain is a lightweight, extensible blockchain project designed for **simplicity** and **flexibility**. It features a basic `proof-of-work (PoW)` consensus with plans for **plug-and-play** consensus mechanisms like Proof of Stake (PoS)

## Key Features

- **Pluginable Consensus**: You can plug your own Consensus algorithm or use the default Simple PoW implementation
- **Wallet Management**: Efficiently manage digital wallets, track balances, and handle transactions
- **Key Pair Generation**: Easily create key pairs for transaction signing and verification
- **RESTful API**: Integrate with external systems through a RESTful API, enabling seamless interaction with the blockchain
- **Node Discovery and Synchronization**: Discover and synchronize with other nodes in the network, ensuring consistent state
- **Transaction Pool**: Maintain a pool of pending transactions to be included in new blocks
- **Chain Validation**: Verify the integrity of the blockchain by validating blocks and transactions

## Installation

To get started with GoodChain, clone the repository and install the necessary dependencies:

```bash
git clone https://github.com/mlibre/GoodChain.git
cd GoodChain
npm install
```

## Usage

### Running the RESTful API

```bash
npm start -- --url "http://localhost:3000" --nodes "http://localhost:3001" --blockchainFile "./db/blockchain.json" --walletsFile "./db/wallets.json" --minerKeysFile "./keys/miner.json" --blockchainName "GoodChain"
```

This command will start the RESTful API server for the GoodChain project, using the specified configuration options.

### Running Multiple Nodes

You can run multiple nodes in the GoodChain network by providing different URLs and ports. For example:

```bash
# Node 1
npm run 3000

# Node 2
npm run 3001

# Node 3
npm run 3002
```

Each node will have its own blockchain data, wallets, and nodes list, but they can communicate and synchronize with each other to maintain a consistent state.

### Running the blockchain without the RESTful API

If you want to run the blockchain without the RESTful API, you can use the `Blockchain` class directly. For example:

```javascript
const Blockchain = require( "./library/chain" );
const Transaction = require( "./library/transactions" )
const Consensus = require( "./library/pow-consensus" );
const consensus = new Consensus()

const { deleteFile, initJsonFile, createKeyPair } = require( "./library/utils" )
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

const trx = new Transaction({
 from: minerKeys.publicKey,
 to: userKeys.publicKey,
 amount: 50,
 fee: 0,
 transaction_number: 1
});
trx.sign( minerKeys.privateKey );

const blockNumber = blockchain.addTransaction( trx.data );
blockchain.mineNewBlock();
console.log( "Mined block :", blockNumber, blockchain.latestBlock );

const trx2 = new Transaction({
 from: userKeys.publicKey,
 to: "user3",
 amount: 5,
 fee: 0.3,
 transaction_number: 1
});
trx2.sign( userKeys.privateKey );

blockchain.addTransaction( trx2.data );
blockchain.mineNewBlock();

console.log( "chain validation:", blockchain.validateChain() );
console.log( "Latest Block :", blockchain.latestBlock );
console.log( "Wallets : ", blockchain.wallet );

```

```js
node main.js
```

## RESTful API

`GoodChain` provides a **RESTful API** for interacting with the blockchain. Some example endpoints include:

| Endpoint              | Method | Description                                                                                    |
| --------------------- | ------ | ---------------------------------------------------------------------------------------------- |
| `/block`              | GET    | Retrieves information about a specific block or the latest block if no parameters are provided |
| `/block`              | POST   | Adds a new block to the blockchain                                                             |
| `/block/broadcast`    | GET    | Broadcasts the latest block to all nodes in the network                                        |
| `/chain`              | GET    | Retrieves the entire blockchain                                                                |
| `/chain/update`       | POST   | Updates the local blockchain by fetching blocks from other nodes                               |
| `/mine`               | GET    | Mines a new block and adds it to the blockchain                                                |
| `/node`               | GET    | Retrieves information about all nodes in the network                                           |
| `/node`               | POST   | Adds a new node to the network                                                                 |
| `/node/update`        | POST   | Updates the local node's knowledge of the network by fetching data from other nodes            |
| `/node/broadcast`     | GET    | Introduces the local node to all other nodes in the network                                    |
| `/transaction`        | GET    | Retrieves pending transactions                                                                 |
| `/transaction`        | POST   | Adds a new transaction to the transaction pool                                                 |
| `/transaction/update` | GET    | Updates the local transaction pool by fetching transactions from other nodes                   |
| `/transaction/sign`   | POST   | Signs a transaction with a private key                                                         |
| `/wallet`             | GET    | Retrieves information about wallets in the blockchain                                          |

There is also a **Bruno** collection, you can find in `useful-assets` folder.

## License

This project is licensed under the `GPL` License

## Donate :heartpulse:

ETH:
> 0xc9b64496986E7b6D4A68fDF69eF132A35e91838e
