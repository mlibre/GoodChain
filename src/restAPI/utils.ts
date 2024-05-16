import _ from "lodash";

export const isEqualBlock = function ( block1: BlockData, block2: BlockData ): boolean
{
	return _.isEqual( block1, block2 );
}

export const parseUrl = function ( url: string ): { host: string, port: string | number, protocol: string }
{
	const urlObj = new URL( url );
	const protocol = urlObj.protocol.replace( ":", "" );
	const host = urlObj.hostname;
	const { port } = urlObj;
	return { host, port, protocol };
}

export const toNum = function ( value: unknown ): number
{
	return Number( value );
}

export const convertErrorToSimpleObj = function ( err: CustomError )
{
	if ( err.isAxiosError )
	{
		delete err.config
		delete err.request
	}
	const simpleErr: SimpleError = {};
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