export default class levelDatabase {
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
}
//# sourceMappingURL=database.js.map