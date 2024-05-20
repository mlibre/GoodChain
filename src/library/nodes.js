"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var utils_js_1 = require("./utils.js");
var Nodes = /** @class */ (function () {
    function Nodes(folderPath, nodes) {
        var _a;
        this.filePath = (0, utils_js_1.makeFilePath)(folderPath, "nodes", "nodes.json");
        var nodesFile = (0, utils_js_1.initJsonFile)(this.filePath);
        this.list = lodash_1.default.uniq(nodes.list.concat(nodesFile.list || []));
        this.hostUrl = (_a = nodes.hostUrl) !== null && _a !== void 0 ? _a : nodesFile.hostUrl;
        this.updateDB();
    }
    Object.defineProperty(Nodes.prototype, "all", {
        get: function () {
            return this.list.concat(this.hostUrl);
        },
        enumerable: false,
        configurable: true
    });
    Nodes.prototype.add = function (url) {
        if (!this.isDuplicate(url)) {
            this.list.push(url);
            this.updateDB();
            return true;
        }
        return false;
    };
    Nodes.prototype.addBulk = function (urls) {
        for (var _i = 0, urls_1 = urls; _i < urls_1.length; _i++) {
            var url = urls_1[_i];
            this.add(url);
        }
    };
    Nodes.prototype.isDuplicate = function (url) {
        return this.all.indexOf(url) !== -1;
    };
    Nodes.prototype.parseUrl = function (url) {
        var urlObj = new URL(url);
        var protocol = urlObj.protocol.replace(":", "");
        var host = urlObj.hostname;
        var port = urlObj.port;
        return { host: host, port: port, protocol: protocol };
    };
    Nodes.prototype.updateDB = function () {
        (0, utils_js_1.updateFile)(this.filePath, {
            list: this.list,
            hostUrl: this.hostUrl,
        });
    };
    return Nodes;
}());
exports.default = Nodes;
