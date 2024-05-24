import _ from "lodash";
import { initJsonFile, generateFilePath, updateFile } from "./utils.js";
export default class Nodes {
    filePath;
    list;
    hostUrl;
    constructor(folderPath, nodes) {
        this.filePath = generateFilePath(folderPath, "nodes", "nodes.json");
        const nodesFile = initJsonFile(this.filePath);
        this.list = _.uniq(nodes.list.concat(nodesFile.list || []));
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
        updateFile(this.filePath, {
            list: this.list,
            hostUrl: this.hostUrl
        });
    }
}
//# sourceMappingURL=nodes.js.map