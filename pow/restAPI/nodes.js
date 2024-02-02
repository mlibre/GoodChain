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
		if ( !this.list.includes( info ) )
		{
			this.list.push( info );
			return true;
		}
		return false;
	}

	delete ( info )
	{
		const index = this.list.indexOf( info );
		if ( index !== -1 )
		{
			this.list.splice( index, 1 );
			return true;
		}
		return false;
	}

	get all ()
	{
		return this.list.concat( this.hostInfo );
	}
}

module.exports = new Nodes({ port, host, protocol });
