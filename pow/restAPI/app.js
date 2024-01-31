var express = require( "express" );
var cookieParser = require( "cookie-parser" );
var logger = require( "morgan" );

var indexRouter = require( "./routes/index" );
var blockchainRouter = require( "./routes/blockchain" );

var app = express();

app.use( logger( "dev" ) );
app.use( express.json() );
app.use( express.urlencoded({ extended: false }) );
app.use( cookieParser() );

app.use( "/", indexRouter );
app.use( "/blockchain", blockchainRouter );

module.exports = app;
