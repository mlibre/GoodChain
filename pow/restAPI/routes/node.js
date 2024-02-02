const express = require( "express" );
const router = express.Router();
const nodes = require( "../nodes" );
const axios = require( "axios" );

router.get( "/", function ( req, res, next )
{
	res.send( nodes.list );
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
			const nodeList = response.data;
			for ( let j = 0; j < nodeList.length; j++ )
			{
				const newNode = nodeList[j];
				if ( !nodes.list.some( existingNode =>
				{
					return existingNode.port === newNode.port &&
						existingNode.host === newNode.host &&
						existingNode.protocol === newNode.protocol
				}) )
				{
					nodes.add( newNode );
				}
			}
		}
		catch ( error )
		{
			console.error( `Error fetching data from node ${node.url}:`, error.message );
		}
	}
	res.send( nodes.list );
});



module.exports = router;
