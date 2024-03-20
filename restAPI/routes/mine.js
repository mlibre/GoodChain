const express = require( "express" );
const router = express.Router();
const blockchain = require( "../blockchain" );

router.get( "/", function ( req, res, next )
{
	const block = blockchain.mineNewBlock();
	res.send( block );
});

module.exports = router;
