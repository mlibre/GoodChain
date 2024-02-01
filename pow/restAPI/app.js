const http = require( "http" );
const express = require( "express" );
const cookieParser = require( "cookie-parser" );
const logger = require( "morgan" );
const { port, host } = require( "./config" );


require( "./blockchain" )
const nodes = require( "./nodes" )
nodes.add({ host, port });

const blockchainRouter = require( "./routes/blockchain" );
const transactionRouter = require( "./routes/transaction" );
const mineRouter = require( "./routes/mine" );
const nodeRouter = require( "./routes/node" );

const app = express();
app.use( logger( "dev" ) );
app.use( express.json() );
app.use( express.urlencoded({ extended: false }) );
app.use( cookieParser() );
app.set( "port", port );

app.use( "/blockchain", blockchainRouter );
app.use( "/transaction", transactionRouter );
app.use( "/mine", mineRouter );
app.use( "/nodes", nodeRouter );


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