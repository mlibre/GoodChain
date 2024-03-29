const http = require( "http" );
const express = require( "express" );
const cookieParser = require( "cookie-parser" );
const logger = require( "morgan" );
const { hostPort, hostAddress } = require( "./config" );
const { convertErrorToSimpleObj } = require( "./utils" )


require( "./blockchain" )

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
app.set( "port", hostPort );

app.use( "/chain", chainRouter );
app.use( "/block", blockRouter );
app.use( "/wallet", walletRouter );
app.use( "/transaction", transactionRouter );
app.use( "/mine", mineRouter );
app.use( "/nodes", nodeRouter );
app.use( errorHandler )

const server = http.createServer( app );
server.listen( hostPort, hostAddress );
server.on( "error", onError );
server.on( "listening", onListening );


function onListening ()
{
	console.log( "Listening on", server.address().address, server.address().port );
}

function onError ( error )
{
	if ( error.syscall !== "listen" )
	{
		throw error;
	}

	const bind = typeof port === "string" ?
		`Pipe ${ hostPort}` :
		`Port ${ hostPort}`;

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

function errorHandler ( err, req, res, next )
{
	if ( res.headersSent )
	{
		return next( err )
	}
	res.status( 500 ).send( convertErrorToSimpleObj( err ) )
}