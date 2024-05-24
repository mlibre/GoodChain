"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const utils_js_1 = require("./utils.js");
const guards_js_1 = require("../guards.js");
class GitDatabase {
    repoPath;
    constructor(repoPath) {
        this.repoPath = repoPath;
        this.cleanInit();
    }
    cleanInit() {
        (0, utils_js_1.createFolder)(this.repoPath);
        const initOutput = (0, child_process_1.execSync)("git init .", { cwd: this.repoPath }).toString();
        console.log("Git repository initialized ", initOutput);
        (0, child_process_1.execSync)("git reset --hard", { cwd: this.repoPath }).toString();
        const cleanOutput = (0, child_process_1.execSync)("git clean -d -x -f", { cwd: this.repoPath }).toString();
        console.log("Git repository cleaned ", cleanOutput);
    }
    commit(blockNumber) {
        const addOutput = (0, child_process_1.execSync)("git add --all", { cwd: this.repoPath }).toString();
        console.log("Git repository added files ", addOutput);
        try {
            (0, child_process_1.execSync)(`git commit -m "${blockNumber}"`, { cwd: this.repoPath }).toString();
        }
        catch (error) {
            if ((0, guards_js_1.isErrorWithStds)(error)) {
                console.error(error.stdout.toString());
                if (error.status !== 1) {
                    throw error;
                }
            }
            else {
                throw new Error(`Unexpected error during commit: ${error}`);
            }
        }
    }
    reset() {
        const resetOutput = (0, child_process_1.execSync)("git reset --hard", { cwd: this.repoPath }).toString();
        console.log("Git repository reset", resetOutput);
    }
}
exports.default = GitDatabase;
//# sourceMappingURL=database.js.map