const express = require( "express" );
const router = express.Router();
const { blockchain, nodes } = require( "../blockchain" );

router.get( "/", function ( req, res, next )
{
	res.send( nodes );
});

router.get( "/", function ( req, res, next )
{
	nodes.push( req.body )
	res.send( blockchain.chain );
});


module.exports = router;
