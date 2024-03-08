# GoodChain

Welcome to **GoodChain**  where blockchain meets simplicity and flexibility!  
Whether you're a seasoned developer or just starting to explore the world of blockchain technology, GoodChain is here to make your journey exciting and rewarding.  
**GoodChain** is a distributed ledger that allows you to initiate transactions securely. These transactions are irreversible once confirmed, ensuring the integrity of your data and assets. This is achieved by using a `peer-to-peer` network of nodes, which are connected to each other through a network of nodes.  
**GoodChain** It is written in `nodejs` and uses `git`(not yet,soon) as its database. It features a basic `proof-of-work (PoW)` consensus. You can also plug your own consensus mechanisms like `Proof of Stake (PoS)` or any other custom consensus mechanism you may have in mind.

## Key Features 🚀

- **Pluginable Consensus**: Have fun experimenting with different consensus algorithms or stick with the default Simple PoW implementation
- **RESTful API**: Integrate with external systems through a RESTful API, enabling seamless interaction with the blockchain
- **Wallet Management**: Efficiently manage digital wallets, track balances, and handle transactions
- **Node Discovery and Synchronization**: Discover and sync with other nodes in the network to maintain a consistent state across the blockchain
- **Transaction Pool**: Maintain a pool of pending transactions to be included in new blocks
- **Chain Validation**: Verify the integrity of the blockchain by validating blocks and transactions

## Installation 🛠️

To embark on your `GoodChain` adventure, simply clone the repository and install the dependencies:

```bash
git clone https://github.com/mlibre/GoodChain.git
cd GoodChain
npm install
```

## Usage

### Running the RESTful API 🌐

This command will start the `RESTful API` server for the GoodChain project

```bash
npm start -- --url "http://localhost:3000" --nodes "http://localhost:3001" --blockchainFile "./db/blockchain.json" --walletsFile "./db/wallets.json" --minerKeysFile "./keys/miner.json" --blockchainName "GoodChain"
```

### Running Multiple Nodes 🌟

Get playful and run multiple nodes in the GoodChain network! Each node will have its own unique identity and contribute to the decentralized magic. For example:

```bash
# Node 1
npm run 3000

# Node 2
npm run 3001

# Node 3
npm run 3002
```

Each node will have its own blockchain data, wallets, and nodes list, but they can communicate and synchronize with each other to maintain a consistent state.

## RESTful API Endpoints 🛣️

`GoodChain` provides a treasure trove of **http API** endpoints for your blockchain interactions. Explore, experiment, and have fun building amazing applications!

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

Check out the **Bruno collection** in the `useful-assets` folder for a quick start with API requests.

### Using Goodchain without the RESTful API 🏃‍♂️

Want to dive deeper into the blockchain mechanics? Use the Blockchain class directly for a hands-on experience

```javascript
const Blockchain = require( "./library/chain" );
const Transaction = require( "./library/transactions" )
const Consensus = require( "./library/pow-consensus" );
const consensus = new Consensus()

const { deleteFile, initJsonFile, createKeyPair } = require( "./library/utils" )
deleteFile( "./assets/db/blockchain.json" );
deleteFile( "./assets/db/wallets.json" );
deleteFile( "./assets/db/nodes.json" );
deleteFile( "./assets/keys/miner.json" );
deleteFile( "./assets/keys/user.json" );

const userKeys = initJsonFile( "./assets/keys/user.json", createKeyPair() );
const minerKeys = initJsonFile( "./assets/keys/miner.json", createKeyPair() );
const blockchain = new Blockchain({
 chainFilePath: "./assets/db/blockchain.json",
 walletFilePath: "./assets/db/wallets.json",
 nodes: {
  filePath: "./assets/db/nodes.json",
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

## License 📜

This project is licensed under the `GPL` License

## Donate 💖

ETH:
> 0xc9b64496986E7b6D4A68fDF69eF132A35e91838e
