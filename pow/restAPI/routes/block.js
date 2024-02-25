const express = require( "express" );
const axios = require( "axios" );
const router = express.Router();
const blockchain = require( "../blockchain" );
const nodes = require( "../nodes" );

router.get( "/", function ( req, res )
{
	let { index, from, to } = req.query;
	if ( !index && !from && !to )
	{
		res.json( blockchain.latestBlock );
		return
	}
	else if ( index )
	{
		index = Number( index ) || undefined
		res.json( blockchain.getBlock( index ) );
		return;
	}
	else if ( from || to )
	{
		from = Number( from ) || undefined
		to = Number( to ) || undefined
		const blocks = blockchain.getBlocks( from, to );
		res.json( blocks );
		return;
	}
});

router.post( "/", function ( req, res, next )
{
	const block = blockchain.addBlock( req.body );
	res.send( block );
});

router.get( "/broadcast", async function ( req, res, next )
{
	for ( const node of nodes.list )
	{
		try
		{
			await axios.post( `${node}/block`, blockchain.latestBlock );
		}
		catch ( error )
		{
			console.error( `Error broadcasting to node ${node}:`, error.message );
		}
	}
	res.send( "Broadcasted to all nodes" );
})

module.exports = router;
