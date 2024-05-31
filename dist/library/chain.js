import * as Block from "./block.js";
export default class ChainStore {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    db;
    sublevel;
    constructor(leveldb) {
        this.sublevel = "chain";
        this.db = leveldb.sublevel(this.sublevel, { valueEncoding: "json" });
    }
    async length() {
        return await this.lastKey();
    }
    async lastKey() {
        let lastKey;
        const iterator = this.db.keys({ reverse: true });
        for await (const key of iterator) {
            lastKey = key;
            break;
        }
        if (!lastKey) {
            throw new Error("No blocks found");
        }
        return Number(lastKey);
    }
    async getAll() {
        const result = await this.db.values().all();
        return result;
    }
    async get(blockNumber) {
        const blockIndex = parseInt(blockNumber.toString());
        if (blockIndex >= await this.length() || blockIndex < 0) {
            throw new Error("Invalid block number");
        }
        const block = await this.db.get(blockIndex.toString());
        return block;
    }
    async getRange(from, to) {
        const blocks = [];
        to = to ?? await this.length();
        for (let i = from; i <= to; i++) {
            blocks.push(await this.get(i));
        }
        return blocks;
    }
    async genesisBlock() {
        return await this.get(0);
    }
    async latestBlock() {
        const lastKey = await this.lastKey();
        const lastBlock = await this.get(lastKey);
        if (!lastBlock) {
            throw new Error("No blocks found");
        }
        return lastBlock;
    }
    pushAction(block) {
        const action = {
            type: "put",
            sublevel: this.sublevel,
            key: block.index.toString(),
            value: block
        };
        return action;
    }
    async lastTwoBlocks() {
        const lastBlock = await this.latestBlock();
        const secondLastBlock = await this.get(lastBlock.index - 1);
        return [lastBlock, secondLastBlock];
    }
    async validateChain() {
        for (let i = 0; i <= await this.length(); i++) {
            if (i === 0) {
                Block.verifyGenesisBlock(await this.get(i));
            }
            else {
                Block.verifyBlock(await this.get(i), await this.get(i - 1));
            }
        }
        return true;
    }
    async isEmpty() {
        try {
            await this.lastKey();
            return false;
        }
        catch (error) {
            if (error instanceof Error && error.message === "No blocks found") {
                return true;
            }
            throw error;
        }
    }
}
//# sourceMappingURL=chain.js.map