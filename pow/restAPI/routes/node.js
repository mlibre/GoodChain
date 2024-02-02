const express = require( "express" );
const router = express.Router();
const nodes = require( "../nodes" );
const axios = require( "axios" );

router.get( "/", function ( req, res, next )
{
	res.send( nodes.all );
});

router.post( "/", function ( req, res, next )
{
	nodes.add( req.body )
	res.send( "ok" );
});


router.post( "/update", async function ( req, res, next )
{
	for ( const node of nodes.list )
	{
		try
		{
			const response = await axios.get( `${node.protocol}://${node.host}:${node.port}/nodes` );
			nodes.addBulk( response.data );
		}
		catch ( error )
		{
			console.error( `Error fetching data from node ${node.url}:`, error.message );
		}
	}
	res.send( nodes.all );
});

router.get( "/broadcast", async function ( req, res, next )
{
	for ( const node of nodes.list )
	{
		try
		{
			await axios.post( `${node.protocol}://${node.host}:${node.port}/nodes`, {
				protocol: nodes.hostInfo.protocol,
				host: nodes.hostInfo.host,
				port: nodes.hostInfo.port,
			});
		}
		catch ( error )
		{
			console.error( `Error introducing self to node ${node.url}:`, error.message );
		}
	}
	res.send( "Introduced self to all nodes" );
});




module.exports = router;
