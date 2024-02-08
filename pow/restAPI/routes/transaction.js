const express = require( "express" );
const router = express.Router();
const blockchain = require( "../blockchain" );
const nodes = require( "../nodes" );
const axios = require( "axios" );

router.get( "/", function ( req, res )
{
	res.json( blockchain.transactionPool );
});

router.post( "/", function ( req, res, next )
{
	const { from, to, amount, fee, transaction_number, signature } = req.body;
	const transaction = { from, to, amount, fee, transaction_number, signature };
	const blockNumber = blockchain.addTransaction( transaction );
	res.send( blockNumber.toString() );
});

router.get( "/update", async function ( req, res, next )
{
	try
	{
		for ( const node of nodes.list )
		{
			const response = await axios.get( `${node.url}/transaction` );
			for ( const transaction of response.data )
			{
				blockchain.addTransaction( transaction );
			}
		}
		res.json( blockchain.transactionPool );
	}
	catch ( error )
	{
		next( error );
	}
});



module.exports = router;
