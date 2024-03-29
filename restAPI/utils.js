const { functions } = require( "lodash" );

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