"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var utils_js_1 = require("./utils.js");
var guards_js_1 = require("../guards.js");
var GitDatabase = /** @class */ (function () {
    function GitDatabase(repoPath) {
        this.repoPath = repoPath;
        this.cleanInit();
    }
    GitDatabase.prototype.cleanInit = function () {
        (0, utils_js_1.createFolder)(this.repoPath);
        var initOutput = (0, child_process_1.execSync)("git init .", { cwd: this.repoPath }).toString();
        console.log("Git repository initialized ", initOutput);
        (0, child_process_1.execSync)("git reset --hard", { cwd: this.repoPath }).toString();
        var cleanOutput = (0, child_process_1.execSync)("git clean -d -x -f", { cwd: this.repoPath }).toString();
        console.log("Git repository cleaned ", cleanOutput);
    };
    GitDatabase.prototype.commit = function (blockNumber) {
        var addOutput = (0, child_process_1.execSync)("git add --all", { cwd: this.repoPath }).toString();
        console.log("Git repository added files ", addOutput);
        try {
            (0, child_process_1.execSync)("git commit -m \"".concat(blockNumber, "\""), { cwd: this.repoPath }).toString();
        }
        catch (error) {
            if ((0, guards_js_1.isErrorWithStds)(error)) {
                console.log(error.stdout.toString());
                if (error.status !== 1) {
                    throw error;
                }
            }
        }
    };
    GitDatabase.prototype.reset = function () {
        var resetOutput = (0, child_process_1.execSync)("git reset --hard", { cwd: this.repoPath }).toString();
        console.log("Git repository reset", resetOutput);
    };
    return GitDatabase;
}());
exports.default = GitDatabase;
