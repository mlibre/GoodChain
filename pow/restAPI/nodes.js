const { port, host } = require( "./config" )
class Nodes
{
	constructor ( nodes )
	{
		this.nodes = nodes || [];
	}

	add ( nodeUrl )
	{
		if ( !this.nodes.includes( nodeUrl ) )
		{
			this.nodes.push( nodeUrl );
			return true;
		}
		return false;
	}

	delete ( nodeUrl )
	{
		const index = this.nodes.indexOf( nodeUrl );
		if ( index !== -1 )
		{
			this.nodes.splice( index, 1 );
			return true;
		}
		return false;
	}

	get list ()
	{
		return this.nodes;
	}
}

module.exports = new Nodes( [ { port, host } ] );
