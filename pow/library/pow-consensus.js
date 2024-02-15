module.exports = class pow
{
	constructor ()
	{
		this.name = "pow";
		this.difficulty = "000fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
	}
	setValues ( block )
	{
		this.difficulty = block.difficulty || this.difficulty;
	}
	getDefaultBlockFields ()
	{
		return {
			consensusDifficulty: this.difficulty,
			consensusName: this.name
		};
	}
}