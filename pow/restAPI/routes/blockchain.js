var express = require( "express" );
var router = express.Router();
const blockchain = require( "../../db/blockchain.json" );

router.get( "/", function ( req, res, next )
{
	res.send( blockchain );
});

module.exports = router;
