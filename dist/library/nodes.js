"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const utils_js_1 = require("./utils.js");
class Nodes {
    filePath;
    list;
    hostUrl;
    constructor(folderPath, nodes) {
        this.filePath = (0, utils_js_1.generateFilePath)(folderPath, "nodes", "nodes.json");
        const nodesFile = (0, utils_js_1.initJsonFile)(this.filePath);
        this.list = lodash_1.default.uniq(nodes.list.concat(nodesFile.list || []));
        this.hostUrl = nodes.hostUrl ?? nodesFile.hostUrl;
        this.updateDB();
    }
    get all() {
        return this.list.concat(this.hostUrl);
    }
    add(url) {
        if (!this.isDuplicate(url)) {
            this.list.push(url);
            this.updateDB();
            return true;
        }
        return false;
    }
    addBulk(urls) {
        for (const url of urls) {
            this.add(url);
        }
    }
    isDuplicate(url) {
        return this.all.indexOf(url) !== -1;
    }
    parseUrl(url) {
        const urlObj = new URL(url);
        const protocol = urlObj.protocol.replace(":", "");
        const host = urlObj.hostname;
        const { port } = urlObj;
        return { host, port, protocol };
    }
    updateDB() {
        (0, utils_js_1.updateFile)(this.filePath, {
            list: this.list,
            hostUrl: this.hostUrl
        });
    }
}
exports.default = Nodes;
//# sourceMappingURL=nodes.js.map