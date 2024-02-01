const express = require( "express" );
const router = express.Router();
const nodes = require( "../nodes" );

router.get( "/", function ( req, res, next )
{
	res.send( nodes.list );
});

router.post( "/", function ( req, res, next )
{
	nodes.add( req.body )
	res.send( "ok" );
});


module.exports = router;
