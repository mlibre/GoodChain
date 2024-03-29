const express = require( "express" );
const router = express.Router();
const blockchain = require( "../blockchain" );
const axios = require( "axios" );

router.get( "/", function ( req, res, next )
{
	res.send( blockchain.nodes.all );
});

router.post( "/", function ( req, res, next )
{
	const result = blockchain.addNode( req.body.url )
	res.send( result );
});


router.post( "/update", async function ( req, res, next )
{
	for ( const node of blockchain.nodes.list )
	{
		try
		{
			const response = await axios.get( `${node}/nodes` );
			blockchain.nodes.addBulk( response.data );
		}
		catch ( error )
		{
			console.error( `Error fetching data from node ${node}:`, error.message );
		}
	}
	res.send( blockchain.nodes.all );
});

router.get( "/broadcast", async function ( req, res, next )
{
	for ( const node of blockchain.nodes.list )
	{
		try
		{
			await axios.post( `${node}/nodes`, {
				url: blockchain.nodes.hosturl
			});
		}
		catch ( error )
		{
			console.error( `Error introducing self to node ${node}:`, error.message );
		}
	}
	res.send( "Introduced self to all nodes" );
});




module.exports = router;
