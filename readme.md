# GoodChain

Welcome to **GoodChain**  where blockchain meets simplicity and flexibility!  
Whether you're a seasoned developer or just starting to explore the world of blockchain technology, **GoodChain** is here to make your journey exciting and rewarding.  

**GoodChain** is a distributed ledger that enables secure and irreversible transactions across a peer-to-peer distributed network of nodes, ensuring the integrity of data.  
**GoodChain** It is written in `TypeScript` and uses `LevelDB` as its database. It adaptable infrastructure allows you to experiment with various `consensus` algorithms or use a default **Simple Proof-of-Work (PoW)** implementation.

## Key Features 🚀

- **Pluginable Consensus**: Have fun experimenting with your consensus algorithms or try the default PoW implementation
- **RESTful API**: Seamlessly integrate external systems with `GoodChain` user-friendly API
- **Wallet Management**: Efficiently manage digital wallets, track balances, and handle transactions
- **Node Discovery and Synchronization**: Discover and sync with other nodes in the network to maintain a consistent state across the blockchain
- **Transaction Pool**: Manage pending transactions with our built-in transaction pool
- **Chain Validation**: Verify the integrity of the blockchain by validating blocks and transactions

## Getting Started 🛠️

To embark on your `GoodChain` adventure, simply clone the repository and install the dependencies:

```bash
git clone https://github.com/mlibre/GoodChain.git
cd GoodChain

# Optional: install the TypeScript, tsx, TSNode, nodemon and Eslint

sudo npm i eslint@latest -g
sudo npm install -g nodemon
sudo npm install -g ts-node
npm i ts-node
sudo npm install -g tsx
npm i tsx
sudo npm i -g typescript

# Install dependencies
npm install

# Generate Your miner keys for the first time
tsx src/test/generateKeys.ts

# Mine the very first block
tsx src/test/init.ts

# You can also run Nodejs files directly
node dist/test/init.js

# Run the GoodChain node
npm run dev
```

## REST API

### Running REST API 🌐

This command will start the `RESTful API` server for the GoodChain project

```bash
npm start -- --host "http://localhost:3000" --nodes "http://localhost:3001" --dbPath "./assets/db/" --minerKeysFile "./keys/miner.json" --name "GoodChain"
```

### Running Multiple REST Nodes 🌟

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

### RESTful API Endpoints 🛣️

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

## Support and Resources 🤝

Check out the **Bruno collection** in the `useful-assets` folder for a quick start with API requests.

## License 📜

This project is licensed under the `GPL` License

## Version 1

The first version of `GoodChain` was built in 2024. It was a simple blockchain implementation that was used to learn about the blockchain technology. It was simply using `json` files to store the blockchain data. You can check out the [realases](https://github.com/mlibre/GoodChain/releases/tag/1.0.5) to see the code.

## Version 2 (latest version)

The second version of `GoodChain` is the successor to the first version. It was built using `Node.js` and `Express.js`, and uses `git` to store the blockchain data.

## Donate 💖

ETH:
> 0xc9b64496986E7b6D4A68fDF69eF132A35e91838e
