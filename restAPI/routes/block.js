const express = require( "express" );
const axios = require( "axios" );
const router = express.Router();
const blockchain = require( "../blockchain" );
const { toNum } = require( "../utils" );

router.get( "/", function ( req, res )
{
	let { index, from, to, list } = req.query;
	const { firstAndLast } = req.query
	if ( !index && !from && !to && !list && !firstAndLast )
	{
		res.json( blockchain.chain.latestBlock );
		return
	}
	else if ( index )
	{
		index = toNum( index )
		res.json( blockchain.getBlock( index ) );
		return;
	}
	else if ( from || to )
	{
		from = toNum( from )
		to = toNum( to )
		const blocks = blockchain.getBlocks( from, to );
		res.json( blocks );
		return;
	}
	else if ( list )
	{
		list = list.split( "," )
		const blocks = [];
		for ( const blcokIndex of list )
		{
			blocks.push( blockchain.getBlock( blcokIndex ) );
		}
		res.json( blocks );
		return;
	}
	else if ( firstAndLast )
	{
		const blocks = []
		blocks.push( blockchain.getBlock( 0 ) );
		blocks.push( blockchain.chain.latestBlock );
		res.json( blocks );
		return;
	}
});

router.post( "/", function ( req, res )
{
	const block = blockchain.addBlock( req.body );
	res.send( block );
});

router.get( "/broadcast", async function ( req, res )
{
	for ( const node of blockchain.nodes.list )
	{
		try
		{
			await axios.post( `${node}/block`, blockchain.chain.latestBlock );
		}
		catch ( error )
		{
			console.error( `Error broadcasting to node ${node}:`, error.message );
		}
	}
	res.send( "Broadcasted to all nodes" );
})

module.exports = router;
