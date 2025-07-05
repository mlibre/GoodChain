export default class LevelDatabase {
    db;
    constructor(leveldb) {
        this.db = leveldb;
    }
    async batch(batch) {
        if (batch.length === 0) {
            return;
        }
        await this.db.batch(batch);
    }
    async clear() {
        await this.db.clear();
        return;
    }
    async close() {
        await this.db.close();
    }
}
//# sourceMappingURL=database.js.map