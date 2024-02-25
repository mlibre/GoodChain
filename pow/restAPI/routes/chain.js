const express = require( "express" );
const router = express.Router();
const blockchain = require( "../blockchain" );
const nodes = require( "../nodes" );
const axios = require( "axios" );

router.get( "/", function ( req, res, next )
{
	res.send( blockchain.chain );
});

router.post( "/update", async function ( req, res, next )
{
	const currentIndex = blockchain.latestBlock.index;
	let nodesLatestBlocks;
	for ( const node of nodes.list )
	{
		try
		{
			const response = await axios.get( `${node}/block`, {
				params: {
					index: currentIndex + 1
				} });
			blockchain.verifyCondidateBlock( response.data );
			nodesLatestBlocks.push( response.data );
		}
		catch ( error )
		{
			console.error( `Error fetching data from node ${node}:`, error );
		}
	}
	const chosenBlock = blockchain.consensus.chooseBlock( nodesLatestBlocks );
	if ( chosenBlock )
	{
		blockchain.addBlock( chosenBlock );
	}
	res.send( blockchain.latestBlock );
});

module.exports = router;
