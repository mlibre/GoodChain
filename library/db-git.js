const { execSync } = require( "child_process" );
const { createFolder } = require( "./utils" );

class GitDatabase
{
	constructor ( repoPath )
	{
		this.repoPath = repoPath;
		this.cleanInit( repoPath );
	}

	cleanInit ( )
	{
		createFolder( this.repoPath );
		const initOutput = execSync( "git init .", { cwd: this.repoPath }).toString();
		console.log( "Git repository initialized ", initOutput );

		const cleanOutput = execSync( "git clean -d -x -f", { cwd: this.repoPath }).toString();
		console.log( "Git repository cleaned ", cleanOutput );
	}

	commit ( blockNumber )
	{
		const addOutput = execSync( "git add --all", { cwd: this.repoPath }).toString();
		console.log( "Git repository commited ", addOutput );

		try
		{
			const commitOutput = execSync( `git commit -m "${blockNumber}"`, { cwd: this.repoPath }).toString();
			console.log( "Git repository commited ", commitOutput );
		}
		catch ( error )
		{
			console.log( error.stdout.toString() );
			if ( error.status != 1 )
			{
				throw error
			}
		}
	}

	reset ()
	{
		const resetOutput = execSync( "git reset --hard", { cwd: this.repoPath }).toString()
		console.log( "Git repository reset", resetOutput )
	}
}

module.exports = GitDatabase;