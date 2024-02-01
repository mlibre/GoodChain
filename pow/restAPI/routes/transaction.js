const express = require( "express" );
const router = express.Router();
const blockchain = require( "../blockchain" );
router.post( "/", function ( req, res, next )
{
	const { from, to, amount, fee, transaction_number, signature } = req.body;
	const transaction = { from, to, amount, fee, transaction_number, signature };
	blockchain.addTransaction( transaction );
	res.send( transaction );
});

module.exports = router;
