# GoodChain

Welcome to **GoodChain**, a blockchain platform designed for both beginners and experienced users, seeking simplicity and flexibility. Built with `TypeScript` and `LevelDB`, **GoodChain** offers a customizable environment for experimenting with consensus algorithms, including a default Simple **Proof-of-Work (PoW)** option.

**GoodChain** is a distributed ledger that enables secure and irreversible transactions across a peer-to-peer distributed network of nodes, ensuring the integrity of data.

## Key Features 🚀

- **Pluggable Consensus**: Experiment with your consensus algorithms or use the default PoW implementation
- **RESTful API**: Seamlessly integrate external systems with `GoodChain`'s user-friendly API
- **Wallet Management**: Efficiently manage digital wallets, track balances, and handle transactions
- **Node Discovery and Synchronization**: Discover and sync with other nodes in the network to maintain a consistent state across the blockchain
- **Transaction Pool**: Manage pending transactions with our built-in transaction pool
- **Chain Validation**: Verify the integrity of the blockchain by validating blocks and transactions
- **EKVS**: `Embeddable persistent key-value stores` are databases that can be embedded into your application. This means `no separate server` or process is needed to manage the database. `LevelDB` is a popular example of an `EKVS`. `GoodChain` uses the `Level` library, a `Node.js` wrapper for `LevelDB`.

## Getting Started 🛠️

To embark on your `GoodChain` adventure, simply clone the repository and install the dependencies:

```bash
# Clone the repository
git clone https://github.com/mlibre/GoodChain.git
cd GoodChain

# Install global dependencies
sudo npm install -g nodemon tsx typescript eslint vitest

# Install project dependencies
npm install

# Generate your miner keys for the first time
tsx src/test/generateKeys.ts

# Mine the very first block
tsx src/test/init.ts

# You may also run Node.js files directly
node dist/test/init.js

# Run the GoodChain node
npm run dev
```

## REST API

### Running REST API 🌐

Start the `RESTful API` server:

```bash
npm run dev
# OR
npm start -- --host "http://localhost:3000" --nodes "http://localhost:3001" --dbPath "./assets/db/" --minerKeysFile "./assets/keys/miner.json" --name "GoodChain"
```

### Running Multiple REST Nodes 🌟

Run multiple nodes in the GoodChain network! Each node will have its own unique identity and contribute to the decentralized network. For example:

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

`GoodChain` provides a rich set of **HTTP API** endpoints for your blockchain interactions. Explore, experiment, and have fun building amazing applications!

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

## Testing the Project 🧪

To ensure the reliability and correctness of the `GoodChain` project, you can run tests.

### Running All Tests

Run the entire test suite using `vitest`:

```bash
npm run test
# OR
vitest run
```

### Running Tests with the UI

For an interactive testing experience, use the `vitest` UI:

```bash
npm run test-ui
# OR
vitest --ui
```

### Running Specific Tests

To run a specific test file, for example, the blockchain tests:

```bash
npm run test src/test/blockchain.test.ts
```

## Support and Resources 🤝

Check out the **Bruno collection** in the `assets` folder for a quick start with API requests. For further assistance, consider reaching out through our [GitHub Issues](https://github.com/mlibre/GoodChain/issues) page.

## License 📜

This project is licensed under the GNU General Public License.

## Version History

### Version 1

The first version of `GoodChain` was a simple blockchain implementation used to learn about blockchain technology. It used `json` files to store the blockchain data. Check out the [releases](https://github.com/mlibre/GoodChain/releases/tag/1.0.5) to see the code.

### Version 2

The second version of `GoodChain` was built using `Node.js` and `Express.js`, and used `git` to store the blockchain data. Check out the [releases](https://github.com/mlibre/GoodChain/releases/tag/2.0.2) to see the code.

### Version 3 (latest version)

The third version of `GoodChain` is built using `TypeScript`, `Express.js`, and `LevelDB`.

## Donate 💖

If you find `GoodChain` helpful and would like to support its development, you can donate ETH to the following address:

> 0xc9b64496986E7b6D4A68fDF69eF132A35e91838e