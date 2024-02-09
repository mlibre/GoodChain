const express = require( "express" );
const router = express.Router();
const _ = require( "lodash" );
const blockchain = require( "../blockchain" );
const trxLib = require( "../../library/transactions" )
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
			const response = await axios.get( `${node}/transaction` );
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

router.post( "/sign", function ( req, res, next )
{
	const transaction = _.pick( req.body, [ "from", "to", "amount", "fee", "transaction_number" ] );
	const signature = trxLib.sign( transaction, req.body.privateKey );
	res.send({ ...transaction, signature });
});

module.exports = router;
