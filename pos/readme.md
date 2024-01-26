# GoodChains

**GoodChains** is a decentralized blockchain Written in `Node.js` from scratch.  
A blockchain designed to be easy to understand and use.

If you are interested in learning how blockchains technically work, this project will hopefully give you a deeper understanding of the concepts.  

## Features

* Written in `Node.js` from scratch
* Unique fair **Proof of Stake** algorithm
* Unique **Wealth Distribution** method
* Uses `json` as the database
* Only **1k** lines of code

## What is GoodChains?

It is a simple implementation of **State-Base**, **Proof of Stake** blockchains.  
in **GoodChains** anyone can be a miner or validator without no pre-conditions.  
There are two native coins in the GoodChains network: `GTC` and `MCT`. `GTC` is used to pay for transaction fees and `MCT` is used to pay for validating a block. `MCT` can be earned by staking `GTC`.  

Each time a validator **mines** a block, they receives `GTC` as the block reward along with transactions fees.  
Validators also burn `ALL` of the their `MCT` as the mining fee.  
This approach gives all the miners a solid win chance, and also makes the network more distributed.  

**GoodChains** also prioritizes **fairness** and wealth distribution. Whenever a validator mines a block, **20-30%** of the block reward along with transaction fees is donated to charities and other similar organizations' accounts.

**GoodChains**  keeps the state and chain in two `JSON` files. To achieve this, it uses [lowdb](https://github.com/typicode/lowdb), A local `JSON` database, which is **fast** and **easy to use**.

## Consensus Mechanism

By consensus, we mean the **majority** of validators have agreed on the same block. 
`GoodChains` uses a customized version of the **Proof of Stake** algorithm to achieve consensus. It simply selects the block candidate from the validator with the highest amount of `MCT`, not `GTC`. The network is kept secure by the fact that malicious nodes must constantly have **51%** of the total amount of `MCT` in their accounts. Because the mining fee is a percentage of the total amount of `MCT` that the validator holds, constantly having **51%** of the total `MCT` is almost impossible.

## Chain Selection Mechanism

In **Proof of Work (PoW)** blockchains like `Bitcoin`, the trust (or correct) chain is the longest chain, which is determined by the chain's **total cumulative** proof of work difficulty. In `PoS` blockchains, another approach is needed to determine the trust chain since there is no CPU work.

In `GoodChains`, each node processes the next block and adds it to its Block Candidate List. Then, they start receiving other nodes' Block Candidate Lists and add them to their own list. Each node then selects the block candidate with the **highest amount** of `MCT` and updates its state and chain. The node then verifies that its chain is the correct chain by requesting the last block from other nodes. If the blocks are the same, everything is fine; otherwise, the node needs to **update** or **replace** its chain.

`GoodChains` uses a simple **reputation mechanism** for this process. The confused node selects the chain from the nodes it trusts most. The list can be inserted manually by the validator, or they can use the **default** algorithm to create the list. The **default** algorithm reviews the confused node's chain and calculates a **trust point** for each validator based on **how many times** they have mined a block. The node then chooses the chain with the **highest trust point**.

## Installation

To install GoodChains, run the following command:

```bash
npm install goodchain
```

## Usage

Check out the [examples](./example/index.js) for more information.

## Architecture

It is pretty much just like any other blockchains. each block contains a `previous hash` which is the hash of the previous block. And a `hash` which is a `sha3-512` hash of the block object.

### Blocks

Straight forward, this is an example of a block:

```json
{
 "index": 1,
 "timestamp": 1642880361445,
 "transactions": [],
 "block_reward": 30,
 "previous_hash": "0000000000000000000000000000000000000000",
 "extra": "The intention of the donations is to help all the beings not only human kinds",
 "validator_address": "base64 of a public key",
 "state_hash": "sha3-512 hash of the state json file",
 "validator_sign": ["result of block encryption using validator's private key, RSA algorithm"],
 "hash": "sha3-512 hash of the block object"
}
```

### Transactions

Here is a example of a transaction:

```json
{
 "index": 1,
 "from": "base64 of a public key",
 "to": "base64 of a public key",
 "amount": 1,
 "fee": 1,
 "tickPrice": 0,
 "sign": ["result of transaction encryption using sender's private key, RSA algorithm"],
 "hash": "sha3-512 hash of the transaction object"
}
```

## Glossary

### Candidate block

Each node has a `Candidate Blocks` list. Nodes add a Candidate block to the list only if it is has a valid signature.
