const { port, host, protocol } = require( "./config" )
class Nodes
{
	constructor ( hostInfo, list )
	{
		this.list = list || [];
		this.hostInfo = hostInfo
	}

	add ( info )
	{
		this.list.push( info );
	}

	get all ()
	{
		return this.list.concat( this.hostInfo );
	}
}

module.exports = new Nodes({ port, host, protocol });
