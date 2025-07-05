import express from "express";
const router = express.Router();
import blockchain from "../blockchain.js";
import Transaction from "../../core/transaction.js";
import axios from "axios";

router.get( "/", function ( req, res )
{
	res.json( blockchain.transactionPool );
});

router.post( "/", async function ( req, res, next )
{
	try
	{
		const blockNumber = await blockchain.addTransaction( req.body );
		res.send( blockNumber.toString() );
	}
	catch ( error )
	{
		next( error );
	}
});

router.get( "/update", async function ( req, res )
{
	try
	{
		for ( const node of blockchain.nodes.list )
		{
			const response = await axios.get( `${node}/transaction` );
			await blockchain.addTransactions( response.data );
		}
	}
	catch ( error )
	{
		console.error( error );
	}
	res.json( blockchain.transactionPool );
});

router.post( "/sign", function ( req, res )
{
	const transaction = new Transaction( req.body );
	transaction.sign( req.body.privateKey );
	res.send( transaction.data );
});

export default router;
