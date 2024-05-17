import http from "http";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { hostPort, hostAddress } from "./config.js";
import { convertErrorToSimpleObj } from "./utils.js";

import "./blockchain.js";

import chainRouter from "./routes/chain.js";
import blockRouter from "./routes/block.js";
import walletRouter from "./routes/wallet.js";
import transactionRouter from "./routes/transaction.js";
import mineRouter from "./routes/mine.js";
import nodeRouter from "./routes/node.js";
import { AddressInfo } from "net";

const app = express();
app.use( logger( "dev" ) );
app.use( express.json() );
app.use( express.urlencoded({ extended: false }) );
app.use( cookieParser() );
app.set( "port", hostPort );

app.use( "/chain", chainRouter );
app.use( "/block", blockRouter );
app.use( "/wallet", walletRouter );
app.use( "/transaction", transactionRouter );
app.use( "/mine", mineRouter );
app.use( "/nodes", nodeRouter );
app.use( errorHandler );

const server = http.createServer( app );
server.listen({ port: hostPort, host: hostAddress });
server.on( "error", onError );
server.on( "listening", onListening );

function onListening ()
{
	console.log( "Listening on", ( server.address() as AddressInfo ).address, ( server.address() as AddressInfo ).port );
}

function onError ( error: AnyError )
{
	if ( error.syscall !== "listen" )
	{
		throw error;
	}
	// handle specific listen errors with friendly messages
	switch ( error.code )
	{
	case "EACCES":
		console.error( `${hostPort} requires elevated privileges` );
		if ( !process.exit( 1 ) )
		{
			console.log( "Cant Exit" );
		}
		break
	case "EADDRINUSE":
		console.error( `${hostPort} is already in use` );
		if ( !process.exit( 1 ) )
		{
			console.log( "Cant Exit" );
		}
		break
	default:
		throw error;
	}
}

function errorHandler ( err: CustomError, req: express.Request, res: express.Response, next: express.NextFunction )
{
	if ( res.headersSent )
	{
		return next( err );
	}
	res.status( 500 ).send( convertErrorToSimpleObj( err ) );
}
