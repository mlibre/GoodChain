import express from "express";
const router = express.Router();
import blockchain from "../blockchain.js";

router.get( "/", function ( req, res )
{
	res.send( blockchain.wallet.allData );
});

export default router;
