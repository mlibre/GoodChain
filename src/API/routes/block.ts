import express from "express";
import axios from "axios";
import blockchain from "../blockchain";
import { toNum } from "../utils";

const router = express.Router();

router.get( "/", function ( req, res )
{
	const { list } = req.query;
	const { to, index, from, firstAndLast } = req.query;
	if ( !index && !from && !to && !list && !firstAndLast )
	{
		res.json( blockchain.chain.latestBlock );
		return;
	}
	else if ( index )
	{
		const blockIndex = toNum( index );
		res.json( blockchain.chain.get( blockIndex ) );
		return;
	}
	else if ( from || to )
	{
		const blockFrom = toNum( from );
		const blockTo = toNum( to );
		const blocks = blockchain.getBlocks( blockFrom, blockTo );
		res.json( blocks );
		return;
	}
	else if ( list )
	{
		const blockList = list.toString().split( "," );
		const blocks = [];
		for ( const blcokIndex of blockList )
		{
			blocks.push( blockchain.chain.get( blcokIndex ) );
		}
		res.json( blocks );
		return;
	}
	else if ( firstAndLast )
	{
		const blocks = [];
		blocks.push( blockchain.chain.get( 0 ) );
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
			if ( error instanceof Error )
			{
				console.error( `Error broadcasting to node ${node}:`, error.message );
			}
			else
			{
				console.error( `Error broadcasting to node ${node}`, error );
			}
		}
	}
	res.send( "Broadcasted to all nodes" );
});

export default router;
