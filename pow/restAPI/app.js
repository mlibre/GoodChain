const http = require( "http" );
const express = require( "express" );
const cookieParser = require( "cookie-parser" );
const logger = require( "morgan" );
const { port, host } = require( "./config" );


require( "./blockchain" )
require( "./nodes" )

const chainRouter = require( "./routes/chain" );
const blockRouter = require( "./routes/block" );
const walletRouter = require( "./routes/wallet" );
const transactionRouter = require( "./routes/transaction" );
const mineRouter = require( "./routes/mine" );
const nodeRouter = require( "./routes/node" );

const app = express();
app.use( logger( "dev" ) );
app.use( express.json() );
app.use( express.urlencoded({ extended: false }) );
app.use( cookieParser() );
app.set( "port", port );

app.use( "/chain", chainRouter );
app.use( "/block", blockRouter );
app.use( "/wallet", walletRouter );
app.use( "/transaction", transactionRouter );
app.use( "/mine", mineRouter );
app.use( "/nodes", nodeRouter );
app.use( errorHandler )

const server = http.createServer( app );
server.listen( port, host );
server.on( "error", onError );
server.on( "listening", onListening );

function onError ( error )
{
	if ( error.syscall !== "listen" )
	{
		throw error;
	}

	var bind = typeof port === "string" ?
		`Pipe ${ port}` :
		`Port ${ port}`;

	// handle specific listen errors with friendly messages
	switch ( error.code )
	{
	case "EACCES":
		console.error( `${bind } requires elevated privileges` );
		process.exit( 1 );
		break;
	case "EADDRINUSE":
		console.error( `${bind } is already in use` );
		process.exit( 1 );
		break;
	default:
		throw error;
	}
}

function onListening ()
{
	console.log( "Listening on", server.address().address, server.address().port );
}

function errorHandler ( err, req, res, next )
{
	if ( res.headersSent )
	{
		return next( err )
	}
	res.status( 500 ).send( convertErrorToSimpleObj( err ) )
}

function convertErrorToSimpleObj ( err )
{
	const simpleErr = { };
	if ( err.message )
	{
		simpleErr.message = err.message;
	}
	if ( err.stack )
	{
		simpleErr.stack = err.stack;
	}
	for ( const key of Object.getOwnPropertyNames( err ) )
	{
		if ( err[key] instanceof Error || typeof err[key] === "object" )
		{
			simpleErr[key] = convertErrorToSimpleObj( err[key] );
		}
		else
		{
			simpleErr[key] = err[key];
		}
	}
	return simpleErr;
}