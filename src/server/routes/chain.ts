import express from "express";
const router = express.Router();
import blockchain from "../blockchain.js";
import axios from "axios";
import { isEqualBlock, logAxiosError } from "../utils.js";

router.get( "/", async function ( req, res )
{
	res.send( await blockchain.chain.getAll() );
});

router.post( "/update", async function ( req, res )
{
	let continueUpdate = true;
	while ( continueUpdate )
	{
		const currentIndex = ( await blockchain.chain.latestBlock() ).index;
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
				await blockchain.verifyCandidateBlock( response.data );
				nodesLatestBlocks.push( response.data );
			}
			catch ( error )
			{
				logAxiosError( error, node );
			}
		}

		const chosenBlockResult = blockchain.consensus.chooseBlock( nodesLatestBlocks );
		if ( chosenBlockResult )
		{
			await blockchain.addBlock( chosenBlockResult );
		}
		else
		{
			continueUpdate = false;
		}
	}
	res.send( await blockchain.chain.latestBlock() );
});

router.put( "/sync", async function ( req, res )
{
	const myLatestBlock = await blockchain.chain.latestBlock();
	const otherNodesLastestBlocks = [];
	for ( const node of blockchain.nodes.list )
	{
		try
		{
			const [ firstBlock, lastBlock ] = (
				await axios.get( `${node}/block`, { params: { firstAndLast: true } })
			).data;
			if (
				isEqualBlock( firstBlock, await blockchain.chain.genesisBlock() ) &&
				!isEqualBlock( myLatestBlock, lastBlock )
			)
			{
				otherNodesLastestBlocks.push({ block: lastBlock, node });
			}
		}
		catch ( error )
		{
			console.error( `Error fetching data from node ${node}:`, error );
		}
	}
	const allNodesLastBlocks = [
		...otherNodesLastestBlocks,
		{ block: await blockchain.chain.latestBlock(), node: blockchain.nodes.hostUrl }
	];
	const chosenNodeBlock = blockchain.consensus.chooseChain( allNodesLastBlocks );
	if ( chosenNodeBlock )
	{
		const chosenChain = await axios.get( `${chosenNodeBlock.node}/chain` );
		await blockchain.replaceChain( chosenChain.data );
	}
	res.send( "ok" );
});

export default router;
