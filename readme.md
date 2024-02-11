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
cd GoodChain/pow
npm install
npm start
```

## Example

```javascript
const userKeys = initJsonFile( "./keys/user.json", createKeyPair() );
const minerKeys = initJsonFile( "./keys/miner.json", createKeyPair() );
const blockchain = new Blockchain( "./db/blockchain.json", "./db/wallets.json", "GoodChain", minerKeys );
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

## License

This project is licensed under the `GPL` License

## Donate :heartpulse:

ETH:
> 0xc9b64496986E7b6D4A68fDF69eF132A35e91838e
