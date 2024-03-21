const express = require( "express" );
const router = express.Router();
const blockchain = require( "../blockchain" );
const axios = require( "axios" );
const _ = require( "lodash" );

router.get( "/", function ( req, res, next )
{
	res.send( blockchain.chain );
});

router.post( "/update", async function ( req, res, next )
{
	let chosenBlock = true
	while ( chosenBlock )
	{
		const currentIndex = blockchain.chain.latestBlock().index;
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
	res.send( blockchain.chain.latestBlock() );
});

router.put( "/sync", async function ( req, res, next )
{
	const myLastestBlock = blockchain.chain.latestBlock();
	const otherNodesLastestBlocks = [];
	for ( const node of blockchain.nodes.list )
	{
		try
		{
			const [ firstBlock, lastBlock ] = ( await axios.get( `${node}/block`, { params: { firstAndLast: true } }) ).data;
			if ( blockchain.isEqualGenesisBlock( firstBlock ) && !blockchain.isEqualBlock( myLastestBlock, lastBlock ) )
			{
				otherNodesLastestBlocks.push({ block: lastBlock, node });
			}
		}
		catch ( error )
		{
			console.error( `Error fetching data from node ${node}:`, error );
		}
	}
	const allNodesLastBlocks = [ ...otherNodesLastestBlocks, { block: blockchain.chain.latestBlock(), node: blockchain.nodes.hostUrl } ];
	const chosenNodeBlock = blockchain.consensus.chooseChain( allNodesLastBlocks );
	const chosenChain = await axios.get( `${chosenNodeBlock.node}/chain` );
	blockchain.replaceChain( chosenChain.data );
	res.send( "ok" );
});



module.exports = router;
