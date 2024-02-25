const express = require( "express" );
const router = express.Router();
const blockchain = require( "../blockchain" );
const axios = require( "axios" );

router.get( "/", function ( req, res, next )
{
	res.send( blockchain.chain );
});

router.post( "/update", async function ( req, res, next )
{
	let chosenBlock = true
	while ( chosenBlock )
	{
		const currentIndex = blockchain.latestBlock.index;
		const nodesLatestBlocks = [];
		for ( const node of blockchain.nodes.list )
		{
			try
			{
				const response = await axios.get( `${node}/block`, {
					params: {
						index: currentIndex + 1
					}
				});
				blockchain.verifyCondidateBlock( response.data );
				nodesLatestBlocks.push( response.data );
			}
			catch ( error )
			{
				console.error( `Error fetching data from node ${node}:`, error.code, error.message, error?.response?.data );
			}
		}

		chosenBlock = blockchain.consensus.chooseBlock( nodesLatestBlocks );
		if ( chosenBlock )
		{
			blockchain.addBlock( chosenBlock );
		}
	}
	res.send( blockchain.latestBlock );
});

module.exports = router;
