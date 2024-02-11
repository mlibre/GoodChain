const express = require( "express" );
const router = express.Router();
const blockchain = require( "../blockchain" );
const Transaction = require( "../../library/transactions" )
const nodes = require( "../nodes" );
const axios = require( "axios" );

router.get( "/", function ( req, res )
{
	res.json( blockchain.transactionPool );
});

router.post( "/", function ( req, res, next )
{
	const blockNumber = blockchain.addTransaction( req.body );
	res.send( blockNumber.toString() );
});

router.get( "/update", async function ( req, res, next )
{
	try
	{
		for ( const node of nodes.list )
		{
			const response = await axios.get( `${node}/transaction` );
			blockchain.addBulkTransaction( response.data );
		}
		res.json( blockchain.transactionPool );
	}
	catch ( error )
	{
		next( error );
	}
});

router.post( "/sign", function ( req, res, next )
{
	const transaction = new Transaction( req.body );
	transaction.sign( req.body.privateKey );
	res.send( transaction.data );
});

module.exports = router;
