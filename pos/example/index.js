const GoodChain = require( "../main.js" )
const path = require( "path" )
const fs = require( "fs" )
const { inspect } = require( "util" );
const charities = require( "./charities.json" );

( async () =>
{
	const scriptPath = path.dirname( process.argv[1] )

	const userKeysPath = path.join( scriptPath, "./my_keys/" )
	const userPublicKey = fs.readFileSync( path.join( userKeysPath, "public_key.pem" ), "utf8" )
	const userPrivateKey = fs.readFileSync( path.join( userKeysPath, "private_key.pem" ), "utf8" )

	const validatorKeyPath = path.join( scriptPath, "./validator_keys/" )
	const validatorPublicKey = fs.readFileSync( path.join( validatorKeyPath, "public_key.pem" ), "utf8" )
	const validatorPrivateKey = fs.readFileSync( path.join( validatorKeyPath, "private_key.pem" ), "utf8" )
	const validator = {
		publicKey: validatorPublicKey,
		privateKey: validatorPrivateKey
	}

	const chain = await new GoodChain({ validator })

	const new_transaction = {
		index: 1, // userPublicKey N transaction
		from: validatorPublicKey,
		to: userPublicKey, // it is null for programs
		amount: 1,
		fee: 1,
		tickPrice: 0,
	}
	new_transaction.sign = chain.signTransaction( new_transaction, validatorPrivateKey ) // sign the transaction by the private key of the sender
	new_transaction.hash = chain.hash( new_transaction )
	await chain.new_transaction( new_transaction )
	await chain.new_block()
	// console.log(chain.chain)
	console.log( inspect( chain.chain, { colors: true, depth: null }) )
})();

function generateAndSaveSampleKeyPairs ()
{
	const scriptPath = path.dirname( process.argv[1] )
	const userKeysPath = path.join( scriptPath, "./my_keys/" )
	GoodChain.generateKeyPairs( userKeysPath )

	const userPublicKey = fs.readFileSync( path.join( userKeysPath, "public_key.pem" ), "utf8" )
	const userPrivateKey = fs.readFileSync( path.join( userKeysPath, "private_key.pem" ), "utf8" )

	const validatorKeyPath = path.join( scriptPath, "./validator_keys/" )
	GoodChain.generateKeyPairs( validatorKeyPath )
	return { userPublicKey, userPrivateKey, validatorKeyPath }
}

void async function full ()
{
	const myState = require( "./my_chain/mystate.json" )
	const myChain = require( "./my_chain/mychain.json" )
	const myNodes = require( "./my_chain/mynodes.json" )

	const { userPublicKey, userPrivateKey, validatorKeyPath } = generateAndSaveSampleKeyPairs()

	const validatorPublicKey = fs.readFileSync( path.join( validatorKeyPath, "public_key.pem" ), "utf8" )
	const validatorPrivateKey = fs.readFileSync( path.join( validatorKeyPath, "private_key.pem" ), "utf8" )
	const validator = {
		publicKey: validatorPublicKey,
		privateKey: validatorPrivateKey
	}

	const chain = await new GoodChain({ validator, charities, dbPath: "./", state: myState, chain: myChain, nodes: myNodes })
	// console.log(chain.chain)

	const new_transaction = {
		index: 1, // userPublicKey N transaction
		from: userPublicKey,
		to: validatorPublicKey, // it is null for programs
		amount: 1,
		fee: 1,
		tickPrice: 0,
	}
	new_transaction.sign = chain.signTransaction( new_transaction, userPrivateKey ) // sign the transaction by the private key of the sender
	new_transaction.hash = chain.hash( new_transaction )
	await chain.new_transaction( new_transaction )
	await chain.new_block()
	// console.log(chain.chain)
	console.log( inspect( chain.chain, { colors: true, depth: null }) )
}