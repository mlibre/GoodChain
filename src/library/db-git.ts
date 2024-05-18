import { execSync } from "child_process";
import { createFolder } from "./utils.js";

export default class GitDatabase
{
	repoPath: string;

	constructor ( repoPath: string )
	{
		this.repoPath = repoPath;
		this.cleanInit( );
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
		const addOutput: string = execSync( "git add --all", { cwd: this.repoPath }).toString();
		console.log( "Git repository added files ", addOutput );

		try
		{
			execSync( `git commit -m "${blockNumber}"`, { cwd: this.repoPath }).toString();
		}
		catch ( error: unknown )
		{
			if ( isErrorWithStds( error ) )
			{
				console.log( error.stdout.toString() );
				if ( error.status !== 1 )
				{
					throw error;
				}
			}
		}
	}

	reset ()
	{
		const resetOutput: string = execSync( "git reset --hard", { cwd: this.repoPath }).toString();
		console.log( "Git repository reset", resetOutput );
	}
}