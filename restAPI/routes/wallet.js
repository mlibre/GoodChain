const express = require( "express" );
const router = express.Router();
const blockchain = require( "../blockchain" );

router.get( "/", function ( req, res, next )
{
	res.send( blockchain.wallet.allData );
});

module.exports = router;
