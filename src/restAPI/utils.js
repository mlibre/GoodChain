const _ = require( "lodash" );

exports.isEqualBlock = function ( block1, block2 )
{
	return _.isEqual( block1, block2 );
}

exports.parseUrl = function ( url )
{
	const urlObj = new URL( url );
	const protocol = urlObj.protocol.replace( ":", "" );
	const host = urlObj.hostname;
	const { port } = urlObj;
	return { host, port, protocol };
}

exports.toNum = function ( value )
{
	if ( typeof value === "string" )
	{
		return Number( value );
	}
	else if ( typeof value === "number" )
	{
		return value;
	}
	else
	{
		return value;
	}
}

exports.convertErrorToSimpleObj = function convertErrorToSimpleObj ( err )
{
	if ( err.isAxiosError )
	{
		delete err.config
		delete err.request
	}
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
		if ( err[key] && ( err[key] instanceof Error || typeof err[key] === "object" ) )
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