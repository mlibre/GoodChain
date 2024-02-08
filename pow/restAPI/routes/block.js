const express = require( "express" );
const router = express.Router();
const blockchain = require( "../blockchain" );

router.get( "/", function ( req, res )
{
	res.json( blockchain.getBlock( req.query.block_number ) );
});

router.post( "/", function ( req, res, next )
{
	const block = blockchain.verifyAndAddBlock( req.body );
	res.send( block.toString() );
});



module.exports = router;
