const express = require( "express" );
const router = express.Router();
const blockchain = require( "../blockchain" );
router.post( "/", function ( req, res, next )
{
	res.send( `transction${ blockchain}` );
});

module.exports = router;
