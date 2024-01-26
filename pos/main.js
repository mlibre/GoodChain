const fs = require( "fs" );
const crypto = require( "crypto" );
const { join, dirname } = require( "path" );
const hash = require( "object-hash" );
const lowdb = import( "lowdb" );
const publicIp = import( "public-ip" );
const ip = require( "ip" );
const _ = require( "lodash" );
const mkdirp = require( "mkdirp" );

class GoodChain
{
	constructor ({ chain, state, nodes, dbPath, validator, charities } = {})
	{
		const self = this
		self.chain = chain || [] // blockchain
		self.state = state || {} // state of the blockchain
		self.nodes = nodes || [] // list of nodes, validators or miners
		self.transactions_pool = [] // list of current transactions for the next candidate block
		self.blockReward = 30 // Block reward for successfully mining a block in GCT
		self.feesToCharity = 0.3 // The percentage of the block's fee that will be sent to the charity
		self.rewardToCharity = 0.3 // The percentage of the block's reward that will be sent to the charity
		self.executeScriptPath = dirname( process.argv[1] )
		self.dbPath = dbPath || self.executeScriptPath // path of the database files. state.json and chain.json
		return ( async () =>
		{
			self.validator = await self.init_validator( validator ) // initialize the validator object
			self.charityAddress = charities?.main || self.validator.address
			await self.init_database() // Initialize the chain and state databases
			self.init_addresses( self.charityAddress )
			if ( self.chain.length == 0 ) // Creating the genesis block
			{
				await self.genesis_block()
			}
			return self
		})();
	}

	// Mine a new block and add it to the chain
	async new_block ({ index, previous_hash } = {})
	{
		const self = this
		if ( typeof index == "undefined" )
		{
			index = self.last_block().index + 1
		}
		const block = {
			index, // block number
			timestamp: Date.now(), // block timestamp
			transactions: self.transactions_pool,
			block_reward: self.blockReward,
			previous_hash: previous_hash || self.last_block().hash,
			extra: "The intention of the donations is to help all the beings not only human kinds",
			validator_address: self.validator.address // validator address in hex
		};

		await self.add_block( block )
		return block
	}

	// Add an existing block to the chain
	// Will also update the state of the node
	// and the state_hash of the block, and the hash of the block if it is not calculated yet
	async add_block ( block )
	{
		const self = this
		try
		{
			await self.pre_validate_block( block )
			self.state_update( block )
			block.state_hash ||= self.hash( self.state ) // for when THIS validator mines a block
			block.validator_sign ||= self.signBlock( block ) // for when THIS validator mines a block
			block.hash ||= self.hash( block ) // for when THIS validator mines a block
			self.validate_block( block )
			self.chain.push( block )
			self.transactions_pool = []
			await self.save() // save the state and the chain
			return block;
		}
		catch ( error )
		{
			await self.load()
			console.error( error )
			throw error
		}
	}

	// update the state of the node
	state_update ( block )
	{
		const self = this
		const vAddress = block.validator_address
		self.init_addresses( vAddress )
		// Update state of the validator_address who mined the block
		self.state[vAddress].GCT += self.blockReward - self.blockReward * self.rewardToCharity
		self.state[vAddress].MCT = 0
		self.state[self.charityAddress].GCT += self.blockReward * self.rewardToCharity

		// update the balances of the accounts indicated in the transactions
		for ( let index = 0; index < block.transactions.length; index++ )
		{
			const element = block.transactions[index]
			self.state[vAddress].GCT += element.fee - element.fee * self.feesToCharity
			self.state[self.charityAddress].GCT += element.fee * self.feesToCharity
			self.state[element.from].GCT -= element.fee
			self.state[element.from].GCT -= element.amount
			self.state[element.to].GCT += element.amount
		}
		// validators update their state by exceuting the transactions
		// how ever they can download it as well
	}

	// a quick check on some of the fields of the block
	async pre_validate_block ( block )
	{
		const self = this;

		for ( let index = 0; index < block.transactions.length; index++ )
		{
			const element = block.transactions[index]
			await self.validate_transaction( element )
			if ( self.state[element.from].GTC < element.fee )
			{
				throw new Error( `Not enough funds for the fee in account: ${ element.from}` );
			}
			if ( element.amount > self.state[element.from].GCT )
			{
				throw new Error( `Not enough funds for the transaction in account: ${ element.from}` );
			}
		}

	}

	validate_block ( block )
	{
		const self = this;
		const block_without_hash = _.cloneDeep( block )
		delete block_without_hash.hash;

		// Check if the hash of the block is correct
		if ( block.hash != self.hash( block_without_hash ) )
		{
			throw new Error( "Block hash is not valid" )
		}
		const last_block = self.last_block();

		// Return if it is the genesis block
		if ( last_block == undefined )
		{
			return true;
		}
		if ( last_block.hash != block.previous_hash )
		{
			throw new Error( "Previous hash is not valid" )
		}
		if ( block.timestamp < last_block.timestamp )
		{
			throw new Error( "Block timestamp is not valid" )
		}
		if ( block.index != last_block.index + 1 )
		{
			throw new Error( "Block index is not valid" );
		}
		if ( block.block_reward != self.blockReward )
		{
			throw new Error( "Block reward is not valid" )
		}
		if ( block.state_hash != self.hash( self.state ) )
		{
			throw new Error( "Block state hash is not valid" )
		}

		const block_without_hash_sign = _.cloneDeep( block_without_hash )
		delete block_without_hash_sign.validator_sign;
		if ( !self.checkBlockSign( block_without_hash_sign, block.validator_sign, self.validator.publicKey ) )
		{
			throw new Error( "Block sign is not valid" )
		}
	}

	// Adds a new transaction to the list of transactions
	new_transaction ({ index, from, to, amount, fee, tickPrice, hash, sign })
	{
		const self = this
		from = GoodChain.hex( from )
		to = GoodChain.hex( to )
		self.validate_transaction({ index, from, to, amount, fee, tickPrice, hash, sign })
		self.transactions_pool.push({
			index, // only way to stop a signed transaction from being broadcasted again in future blocks
			// this is the user transaction number. for example 10 means this transaction is the 10th transaction
			// from the user. this is used to prevent a user from sending the same transaction twice and also
			// a hacker to send an old signed transaction to the blockchain
			// This number keep increasing each an address makes a transaction
			from,
			to,
			amount,
			fee, // for transfer, fee is amount of GCT user is paying. it is what it is, validator decide to mine it or not
			// for programs fee is is max amount user will pay for the execution of the program
			tickPrice, // only for programs, it is the price that user has considered for each tick,
			sign, // the signature of the transaction
			hash // hash of the transaction
		});
		// returns block number where this transaction will be included
		return self.last_block().index + 1
	}


	validate_transaction ({ index, from, to, amount, fee, tickPrice, hash, sign })
	{
		const self = this
		from = GoodChain.hex( from )
		to = GoodChain.hex( to )
		const trxWithoutHashAndSign = {
			index,
			from,
			to,
			amount,
			fee,
			tickPrice,
		}
		self.init_addresses( from, to )
		if ( index != self.account_last_index( from ) + 1 )
		{
			throw new Error( "Transaction index is not valid" )
		}
		if ( !self.checkTransactionSign( trxWithoutHashAndSign, sign, GoodChain.hex( from, "hex", "utf8" ) ) )
		{
			throw new Error( "Transaction sign is not valid" )
		}
		// Check if the transaction is valid
		// check if the index value is valid, mean index value should be the same or lower than the last one
	}

	async validate_chain ()
	{
		// Check if hashes are correct
	}

	async trust_chain ()
	{
		// In PoS, the longest chain is not highest cpu work or highest number of blocks
		// Each validator can write his own code to decide which chain is the one he wants to works on
		// for example, chains that comes from the X master node or addresses a,b,c,d which have Y amount of stakes
		// on it or ....
		// The default logic is to choose the block candidate which has most of votes by the validators.
		// it means the block where most of the THIS node validators list accepted it as the next block.
		// also validators votes has power based on the amount of stake they have on the chain or customized points
		// wrote by the validator.
	}

	// Hashes a Block
	hash ( obj )
	{
		return hash( obj, { algorithm: "sha3-512" })
	}

	static hex ( string, from = "utf8", to = "hex" )
	{
		if ( string.startsWith( "-----BEGIN" ) && from == "utf8" && to == "hex" )
		{
			return Buffer.from( string, from ).toString( to )
		}
		else if ( from == "hex" && to == "utf8" )
		{
			return Buffer.from( string, from ).toString( to )
		}
		return string
	}

	// Signs a Block by the validator privateKey
	// to make sure that the address belongs to the validator, a validator should not be able to put
	// other's addresses, because that will minus some MCT from them
	signBlock ( block )
	{
		const self = this
		const shaHash = self.hash( block )
		const key = crypto.createPrivateKey( self.validator.privateKey );
		return crypto.sign( "sha256", Buffer.from( shaHash ), key );
	}

	// Checks if the block is signed by the validator
	checkBlockSign ( block, sign, publicKey )
	{
		const self = this
		const shaHash = self.hash( block )
		return crypto.verify( "sha256", Buffer.from( shaHash ), publicKey, sign );
	}

	// Sign a transaction using privateKey
	signTransaction ( trx, privateKey )
	{
		const self = this;
		trx.from = GoodChain.hex( trx.from );
		trx.to = GoodChain.hex( trx.to );
		const trxHash = self.hash( trx );

		const key = crypto.createPrivateKey( privateKey );
		return crypto.sign( "sha256", Buffer.from( trxHash ), key );
	}

	checkTransactionSign ( trx, sign, publicKey )
	{
		const self = this;
		const trxHash = self.hash( trx );
		return crypto.verify( "sha256", Buffer.from( trxHash ), publicKey, sign );
	}

	static generateKeyPairs ( path )
	{
		const keyPair = crypto.generateKeyPairSync( "rsa", { modulusLength: 512 });
		const publicKey = keyPair.publicKey.export({ type: "pkcs1", format: "pem" });
		const privateKey = keyPair.privateKey.export({ type: "pkcs1", format: "pem" });
		const address = GoodChain.hex( publicKey, "utf8", "hex" );
		mkdirp.sync( path );
		fs.writeFileSync( join( path, "public_key.pem" ), publicKey );
		fs.writeFileSync( join( path, "private_key.pem" ), privateKey );
		fs.writeFileSync( join( path, "public_key.hex" ), address );
		return { publicKey, privateKey, address };
	}

	async genesis_block ()
	{
		const self = this;
		const genesis_block = {
			index: 1,
			previous_hash: "0000000000000000000000000000000000000000"
		};
		await self.new_block( genesis_block );
	}

	// initialize the node info
	// {
	//   publicIp: '83.123.110.245',
	//   networkIp: '192.168.1.121',
	//   publicKey: '',
	//   privateKey: '',
	//   address: '43234'
	// }
	async init_validator ( cValidator = {})
	{
		const p = await ( await publicIp ).default;
		const validator = {
			publicIp: cValidator.publicIp || await p.v4(),
			networkIp: cValidator.networkIp || ip.address(),
			publicKey: cValidator.publicKey,
			privateKey: cValidator.privateKey,
		};
		validator.address = GoodChain.hex( validator.publicKey );
		return validator;
	}

	async init_database ()
	{
		const self = this;

		const { Low } = await lowdb;
		const { JSONFile } = await lowdb;

		const cFile = join( self.dbPath, "chain.json" );
		const cAdapter = new JSONFile( cFile );
		self.chainDB = new Low( cAdapter );
		self.chainDB.data = self.chain;
		await self.save_chain();

		const sFile = join( self.dbPath, "state.json" );
		const sAdapter = new JSONFile( sFile );
		self.stateDB = new Low( sAdapter );
		self.stateDB.data = self.state;
		await self.save_state();
	}

	// initializes addresses with 0 GCT and MCT
	init_addresses ( ...addresses )
	{
		const self = this;
		for ( let index = 0; index < addresses.length; index++ )
		{
			const element = GoodChain.hex( addresses[index] );
			if ( !self.state[element] )
			{
				self.state[element] = {
					GCT: 0,
					MCT: 0,
					index: 0
				};
			}
		}
	}

	register_node ( node )
	{
		// adds a new node to THIS node's list of nodes
		this.nodes.push( node );
	}

	last_block ()
	{
		return this.chain.last();
	}

	account_last_index ( account )
	{
		return this.state[GoodChain.hex( account )].index;
	}

	async save ()
	{
		await this.save_state();
		await this.save_chain();
	}

	async load ()
	{
		await this.load_state();
		await this.load_chain();
	}

	async save_state ()
	{
		await this.stateDB.write();
	}

	async load_state ()
	{
		await this.stateDB.read();
		this.state = this.stateDB.data;
	}

	async save_chain ()
	{
		await this.chainDB.write();
	}

	async load_chain ()
	{
		await this.chainDB.read();
		this.chain = this.chainDB.data;
	}

}

if ( !Array.prototype.last )
{
	Array.prototype.last = function ()
	{
		return this[this.length - 1];
	};
}

module.exports = GoodChain;