import { Level } from "level";

export default class levelDatabase
{
	public db: Level<string, BlockData>;

	constructor ( leveldb: Level<string, BlockData> )
	{
		this.db = leveldb;
	}

	async revert ( key: string )
	{
		const batch: { type: "del"; key: string; }[] = [];

		for await ( const [ k ] of this.db.iterator({ reverse: true }) )
		{
			if ( k > key )
			{
				batch.push({ type: "del", key: k });
			}
		}
		await this.db.batch( batch );
	}

	async clear (): Promise<void>
	{
		await this.db.clear();
		return;
	}

}