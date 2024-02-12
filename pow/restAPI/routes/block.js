const express = require( "express" );
const router = express.Router();
const blockchain = require( "../blockchain" );

router.get( "/", function ( req, res )
{
	res.json( blockchain.getBlock( req.query.index ) );
});

router.post( "/", function ( req, res, next )
{
	const block = blockchain.addBlock( req.body );
	res.send( block );
});



module.exports = router;
