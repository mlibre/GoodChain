const { url, nodes } = require( "./config" )
const _ = require( "lodash" );

class Nodes
{
	constructor ( hosturl, list )
	{
		this.list = this.parseUrlList( list );
		this.hosturl = this.parseUrl( hosturl )
	}

	add ( info )
	{
		if ( !this.isDuplicate( info ) )
		{
			this.list.push( info );
			return true
		}
		return false;
	}

	addBulk ( infos )
	{
		for ( const info of infos )
		{
			this.add( info );
		}
	}

	isDuplicate ( info )
	{
		return !!_.find( this.all, { host: info.host, port: info.port, protocol: info.protocol });
	}

	parseUrl ( url )
	{
		const urlObj = new URL( url );
		const protocol = urlObj.protocol.replace( ":", "" );
		const host = urlObj.hostname;
		const { port } = urlObj;
		return { host, port, protocol };
	}

	parseUrlList ( list )
	{
		return _.map( list, ( node ) =>
		{
			this.parseUrl( node );
		});
	}

	get all ()
	{
		return this.list.concat( this.hosturl );
	}
}

module.exports = new Nodes( url, nodes );
