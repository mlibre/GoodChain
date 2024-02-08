const { url, nodes } = require( "./config" )
const _ = require( "lodash" );

class Nodes
{
	constructor ( hosturl, list )
	{
		this.list = list || [];
		this.hosturl = hosturl
	}

	add ( url )
	{
		if ( !this.isDuplicate( url ) )
		{
			this.list.push( url );
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

	isDuplicate ( url )
	{
		// use indexof
		return this.all.indexOf( url ) !== -1;
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
