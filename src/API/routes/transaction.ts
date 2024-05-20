import express from "express";
const router = express.Router();
import blockchain from "../blockchain.js";
import Transaction from "../../library/transactions.js";
import axios from "axios";

router.get( "/", function ( req, res )
{
	res.json( blockchain.transactionPool );
});

router.post( "/", function ( req, res )
{
	const blockNumber = blockchain.addTransaction( req.body );
	res.send( blockNumber.toString() );
});

router.get( "/update", async function ( req, res )
{
	try
	{
		for ( const node of blockchain.nodes.list )
		{
			const response = await axios.get( `${node}/transaction` );
			blockchain.addTransactions( response.data );
		}
	}
	catch ( error )
	{
		console.log( error );
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
