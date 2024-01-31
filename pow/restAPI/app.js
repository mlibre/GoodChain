const express = require( "express" );
const cookieParser = require( "cookie-parser" );
const logger = require( "morgan" );

const blockchainRouter = require( "./routes/blockchain" );
const transactionRouter = require( "./routes/transaction" );
const mineRouter = require( "./routes/mine" );

const app = express();

app.use( logger( "dev" ) );
app.use( express.json() );
app.use( express.urlencoded({ extended: false }) );
app.use( cookieParser() );

app.use( "/", transactionRouter );
app.use( "/blockchain", blockchainRouter );
app.use( "/mine", mineRouter );

module.exports = app;
