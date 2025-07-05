import express from "express";
import axios from "axios";
import blockchain from "../blockchain.js";
import { toNum } from "../utils.js";

const router = express.Router();

router.get( "/", async ( req, res, next ) =>
{
	try
	{
		const { list, to, index, from, firstAndLast } = req.query;
		if ( !index && !from && !to && !list && !firstAndLast )
		{
			res.json( await blockchain.chain.latestBlock() );
			return;
		}
		if ( index )
		{
			res.json( await blockchain.chain.get( toNum( index ) ) );
			return;
		}
		if ( from || to )
		{
			const result = await blockchain.getBlocks( toNum( from ), toNum( to ) );
			res.json( result );
			return;
		}
		if ( list )
		{
			const blocks = [];
			for ( const index of await list.toString().split( "," ) )
			{
				blocks.push( await blockchain.chain.get( toNum( index ) ) );
			}
			res.json( blocks );
			return;
		}
		if ( firstAndLast )
		{
			res.json( [ await blockchain.chain.get( 0 ), await blockchain.chain.latestBlock() ] );
			return;
		}
	}
	catch ( error )
	{
		next( error );
	}
});

router.post( "/", async ( req, res, next ) =>
{
	try
	{
		const block =
		await blockchain.addBlock( req.body );
		res.json( block );
	}
	catch ( error )
	{
		next( error );
	}
});

router.get( "/broadcast", async ( req, res ) =>
{
	for ( const node of blockchain.nodes.list )
	{
		try
		{
			await axios.post( `${node}/block`, await blockchain.chain.latestBlock() );
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
