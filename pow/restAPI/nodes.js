const { port, host, protocol } = require( "./config" )
const _ = require( "lodash" );

class Nodes
{
	constructor ( hostInfo, list )
	{
		this.list = list || [];
		this.hostInfo = hostInfo
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

	get all ()
	{
		return this.list.concat( this.hostInfo );
	}
}

module.exports = new Nodes({ port, host, protocol });
