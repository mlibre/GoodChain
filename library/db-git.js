// each block is a file
// each block a commit with blokc number as its name
// an state file that store tha latest infomration about each address (balance data , ....)
// will be also in git CustomElementRegistry, so commit 4 has 4 blocks in iteratee. each file a block. and a state file that kep the state until block 4


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

		const commitOutput = execSync( `git commit -m "${blockNumber}"`, { cwd: this.repoPath }).toString();
		console.log( "Git repository commited ", commitOutput );
	}

	reset ()
	{
		const resetOutput = execSync( "git reset --hard", { cwd: this.repoPath }).toString()
		console.log( "Git repository reset", resetOutput )
	}
}

module.exports = GitDatabase;