const express = require( "express" );
const router = express.Router();
const blockchain = require( "../blockchain" );

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

module.exports = router;
