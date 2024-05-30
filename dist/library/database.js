export default class levelDatabase {
    db;
    constructor(leveldb) {
        this.db = leveldb;
    }
    async revert(key) {
        const batch = [];
        for await (const [k] of this.db.iterator({ reverse: true })) {
            if (k > key) {
                batch.push({ type: "del", key: k });
            }
        }
        await this.db.batch(batch);
    }
    async clear() {
        await this.db.clear();
        return;
    }
}
//# sourceMappingURL=database.js.map