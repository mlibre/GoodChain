import { Level } from "level";

export default class levelDatabase
{
	public db: Level<string, BlockData>;

	constructor ( leveldb: Level<string, BlockData> )
	{
		this.db = leveldb;
	}

	async batch ( batch: PutAction[] )
	{
		if ( batch.length === 0 )
		{
			return;
		}
		await this.db.batch( batch );
	}

	async clear (): Promise<void>
	{
		await this.db.clear();
		return;
	}

}