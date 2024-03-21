const path = require( "path" );
const _ = require( "lodash" );
const { initJsonFile, updateFile } = require( "./utils" )

module.exports = class Nodes
{
	constructor ( folderPath, nodes )
	{
		this.filePath = this.makeFilePath( folderPath, "nodes", "nodes.json" );
		const nodesFile = initJsonFile( this.filePath );
		this.list = _.uniq( nodes.list.concat( nodesFile.list || [] ) );
		this.hostUrl = nodes.hostUrl || nodesFile.hostUrl;
		this.updateDB();
	}

	get all ()
	{
		return this.list.concat( this.hostUrl );
	}

	add ( url )
	{
		if ( !this.isDuplicate( url ) )
		{
			this.list.push( url );
			this.updateDB();
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
		return this.all.indexOf( url ) !== -1;
	}

	parseUrlList ( list )
	{
		return _.map( list, ( node ) =>
		{
			this.parseUrl( node );
		});
	}

	updateDB ()
	{
		updateFile( this.filePath, {
			list: this.list,
			hostUrl: this.hostUrl
		});
	}

	makeFilePath ( folderPath, ...params )
	{
		return path.join( folderPath, ...params );
	}
}