const express = require( "express" );
const router = express.Router();
const blockchain = require( "../blockchain" );

router.get( "/", function ( req, res )
{
	const { index, from, to } = req.query;
	if ( !index && !from && !to )
	{
		res.json( blockchain.latestBlock );
		return
	}
	else if ( index )
	{
		res.json( blockchain.getBlock( Number( index ) ) );
		return;
	}
	else if ( from && to )
	{
		const blocks = blockchain.getBlocks( Number( from ), Number( to ) + 1 );
		res.json( blocks );
		return;
	}
});

router.post( "/", function ( req, res, next )
{
	const block = blockchain.addBlock( req.body );
	res.send( block );
});



module.exports = router;
