// each block is a file
// each block a commit with blokc number as its name
// an state file that store tha latest infomration about each address (balance data , ....)
// will be also in git CustomElementRegistry, so commit 4 has 4 blocks in iteratee. each file a block. and a state file that kep the state until block 4


const simpleGit = require( "simple-git" );

class GitDatabase
{
	constructor ( repoPath )
	{
		this.git = simpleGit( repoPath ).clean( simpleGit.CleanOptions.FORCE );
	}

	async commit ( blockNumber )
	{
		await this.git.add( "." );
		await this.git.commit( `${blockNumber}` );
		console.log( `Committed block ${blockNumber}` );
	}

	async cleanRepo ()
	{
		try
		{
			const status = await this.git.status();
			if ( !status.isClean() )
			{
				await this.git.checkout( "." );
				await this.git.clean( "fdx" );
				console.log( "Repository cleaned" );
			}
			else
			{
				console.log( "Repository is already clean" );
			}
		}
		catch ( err )
		{
			console.error( "Error cleaning repository:", err );
		}
	}

	async checkRepo ()
	{
		try
		{
			const status = await this.git.status();
			console.log( "Repository status:", status );
		}
		catch ( err )
		{
			console.error( "Error checking repository status:", err );
		}
	}

	async createBranch ( branchName )
	{
		try
		{
			await this.git.checkoutLocalBranch( branchName );
			console.log( `Created branch ${branchName}` );
		}
		catch ( err )
		{
			console.error( "Error creating branch:", err );
		}
	}

	async switchBranch ( branchName )
	{
		try
		{
			await this.git.checkout( branchName );
			console.log( `Switched to branch ${branchName}` );
		}
		catch ( err )
		{
			console.error( "Error switching branch:", err );
		}
	}

	async mergeBranch ( sourceBranch, targetBranch )
	{
		try
		{
			await this.git.checkout( targetBranch );
			await this.git.merge( [ sourceBranch ] );
			console.log( `Merged ${sourceBranch} into ${targetBranch}` );
		}
		catch ( err )
		{
			console.error( "Error merging branch:", err );
		}
	}
}

module.exports = GitDatabase;