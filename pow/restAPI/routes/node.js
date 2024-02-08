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
			const response = await axios.get( `${node.url}/nodes` );
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
			await axios.post( `${node.url}/nodes`, {
				protocol: nodes.hosturl.protocol,
				host: nodes.hosturl.host,
				port: nodes.hosturl.port,
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
