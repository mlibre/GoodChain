# GoodChain

**GoodChain** is a decentralized **PoS** blockchain. Written in `Node.js` from scratch.  
A blockchain designed to be easy to understand and use.

If you are interested in learning how blockchains technically work, this project will hopefully give you a deeper understanding of the concepts.  
<!-- You can read my [`step-by-step tutorial`](./) article, on how to write this blockchain. -->

## Features

* Written in `Node.js` from scratch
* Unique fair **Proof of Stake** algorithm
* Unique **Wealth Distribution** method
* Uses `json` as the database
* Only **1k** lines of code

## What is GoodChain?

**GoodChain** is a simple implantation of **State Base**, **Proof of Stake** blockchains.  
Anyone can be a miner or a validator, there are no pre-conditions.  

**GoodChain** has two native coins: `GTC` and `MCT`. `GTC` is what is used to pay for transaction fees and `MCT` is used to pay for validating a block. `MCT` can be earned by staking `GTC`.  

Each time a validator **mines** a block, it receives some `GTC` as the block reward plus transactions fees.  
Validators also burn some `MCT` as the mining fee. The amount of `MCT` burned is a percentage of the total amount of `MCT` that the validator has.  
This approach gives better chance to the miners with fewer stakes to get a reward. It also makes the network more distributed.  

I believe that the world's current wealth and resources distribution is not fair. So here at `GoodChain`, we introduced **fairer** distribution. Each time a validator mines a block, **20-25%** of the block reward plus the transactions fees goes to charities and other similar organizations' accounts.

**GoodChain**  keeps state and chain in two `JSON` files. To achieve this purpose, We use [lowdb](https://github.com/typicode/lowdb), A local `JSON` database, which is **fast** and **easy to use**.

## Consensus Mechanism

By consensus, we mean the **majority** of validators have agreed on the same block.  
`GoodChain` uses a customized version of the **Proof of Stake** algorithm to achieve this. It simply selects the block candidate from the validator with the highest amount of `MCT` (not `GCT`).  
The network is kept safe by the fact that malicious nodes must constantly have **51%** of the total amount of `MCT` in their accounts. remember that the **mining fee** is a percentage of the total amount of `MCT` that the validator has. So constantly having **51%** of the total `MCT` is almost impossible.

## Chain Selection Mechanism

In `PoW` blockchains like Bitcoin, the **trust** (or correct) chain is the **longest chain**, which is determined by the chain's **total cumulative** proof of work difficulty. in other words, the chain that took the most energy to build.  
In `PoS` blockchains, there is no CPU work. So another approach is needed to determine the **trust** chain.  

in `GoodChain`, every node, process the next block and adds it to its **Block Candidate List**. Then they start getting other nodes **Block Candidate List** and will add them to their own **Block Candidate List**.  
Then each node selects the block candidate with the highest amount of `MCT`, and update his state and chain.  
Then again each node wants to make sure that its chain is the correct chain (it has chosen the block with the highest amount of `MCT`). So it asks other nodes for their last block. if they are the same then everything is fine, else she needs to update or replace her chain.  

For this, `GoodChain` uses a simple reputation mechanism. The confused node will choose the chain from the nodes she **trusts** most.  This list can be inserted by the validator manually or she can use the default algorithm to make the list.  

The **default algorithm** reviews the confused node's chain, and calculates a trust point for each validator based on how many times a validator has mined a block.  
Then the node will choose the chain with the **highest trust point**.

## Installation

```bash
npm install goodchain
```

## Usage

```javascript
const GoodChain = require("goodchain");
const path = require( "path" );
const fs = require( "fs" );
const { inspect } = require( "util" );

const scriptPath = path.dirname( process.argv[1] );

const userKeysPath = path.join( scriptPath, "./my_keys/" );
const userPublicKey = fs.readFileSync( path.join( userKeysPath, "public_key.pem" ), "utf8" );
const userPrivateKey = fs.readFileSync( path.join( userKeysPath, "private_key.pem" ), "utf8" );

const validatorKeyPath = path.join( scriptPath, "./validator_keys/" );
const validatorPublicKey = fs.readFileSync( path.join( validatorKeyPath, "public_key.pem" ), "utf8" );
const validatorPrivateKey = fs.readFileSync( path.join( validatorKeyPath, "private_key.pem" ), "utf8" );
const validator = {
 publicKey: validatorPublicKey,
 privateKey: validatorPrivateKey
};

const chain = await new GoodChain( { validator } );

const new_transaction = {
 index: 1, // userPublicKey N transaction
 from: userPublicKey,
 to: validatorPublicKey, // it is null for programs
 amount: 1,
 fee: 1,
 tickPrice: 0,
};
new_transaction.sign = chain.signTransaction( new_transaction, userPrivateKey ); // sign the transaction by the private key of the sender
new_transaction.hash = chain.hash( new_transaction );
await chain.new_transaction( new_transaction );
await chain.new_block();
// console.log(chain.chain);
console.log( inspect( chain.chain, { colors: true, depth: null } ) );
```

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
 "validator_sign": "base64 result of block encryption using validator's private key, RSA algorithm",
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
 "sign": "base64 result of transaction encryption using sender's private key, RSA algorithm",
 "hash": "sha3-512 hash of the transaction object"
}
```

## Glossary

### Candidate block

Each node has a `Candidate Blocks` list. Nodes add a Candidate block to the list only if it is has a valid signature.
