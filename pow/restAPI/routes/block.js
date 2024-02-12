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

router.post( "/update", async function ( req, res, next )
{
	const currentIndex = blockchain.latestBlock.index;
	for ( const node of nodes.list )
	{
		try
		{
			const response = await axios.get( `${node}/block`, {
				params: {
					from: currentIndex + 1
				} });
			blockchain.addBlocks( response.data );
		}
		catch ( error )
		{
			console.error( `Error fetching data from node ${node}:`, error.message );
		}
	}
	res.send( blockchain.getBlocks( currentIndex + 1 ) );
});


module.exports = router;
