import { execSync } from "child_process";
import { createFolder } from "./utils.js";
import { isErrorWithStds } from "../guards.js";
import { Level } from "level";

export default class levelDB
{
	repoPath: string;
	db: Level<string, unknown>;

	constructor ( repoPath: string )
	{
		this.repoPath = repoPath;
		this.db = new Level<string, unknown>( repoPath, { valueEncoding: "json" });
		// this.cleanInit();
	}

	cleanInit ()
	{
		createFolder( this.repoPath );
		const initOutput: string = execSync( "git init .", { cwd: this.repoPath }).toString();
		console.log( "Git repository initialized ", initOutput );

		execSync( "git reset --hard", { cwd: this.repoPath }).toString();

		const cleanOutput: string = execSync( "git clean -d -x -f", { cwd: this.repoPath }).toString();
		console.log( "Git repository cleaned ", cleanOutput );
	}

	commit ( blockNumber: string | number )
	{
		try
		{
			execSync( "git add --all", { cwd: this.repoPath });
			execSync( `git commit -m "${blockNumber}"`, { cwd: this.repoPath });
		}
		catch ( error: unknown )
		{
			if ( isErrorWithStds( error ) )
			{
				console.error( error.stdout.toString() );
				if ( error.status !== 1 )
				{
					throw error;
				}
			}
			else
			{
				throw new Error( `Unexpected error during commit: ${error}` );
			}
		}
	}

	reset ()
	{
		execSync( "git reset --hard", { cwd: this.repoPath });
	}
}