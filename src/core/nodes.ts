import _ from "lodash";
import { initJsonFile, generateFilePath, updateFile } from "./utils.js";

export default class Nodes
{
	filePath: string;
	list: string[];
	hostUrl: string;

	constructor ( folderPath: string, nodes: { list: string[], hostUrl?: string })
	{
		this.filePath = generateFilePath( folderPath, "nodes", "nodes.json" );
		const nodesFile = initJsonFile( this.filePath );
		this.list = _.uniq( nodes.list.concat( nodesFile.list || [] ) );
		this.hostUrl = nodes.hostUrl ?? nodesFile.hostUrl;
		this.saveNodesToFile();
	}

	get all (): ( string | undefined )[]
	{
		return this.list.concat( this.hostUrl );
	}

	add ( url: string ): boolean
	{
		if ( !this.isDuplicate( url ) )
		{
			this.list.push( url );
			this.saveNodesToFile();
			return true;
		}
		return false;
	}

	addBulk ( urls: string[] ): void
	{
		for ( const url of urls )
		{
			this.add( url );
		}
	}

	isDuplicate ( url: string ): boolean
	{
		return this.all.indexOf( url ) !== -1;
	}

	parseUrl ( url: URL )
	{
		const urlObj = new URL( url );
		const protocol = urlObj.protocol.replace( ":", "" );
		const host = urlObj.hostname;
		const { port } = urlObj;
		return { host, port, protocol };
	}

	saveNodesToFile (): void
	{
		updateFile( this.filePath, {
			list: this.list,
			hostUrl: this.hostUrl
		});
	}
}
