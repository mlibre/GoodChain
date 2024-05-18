import { execSync } from "child_process";
import { createFolder } from "./utils.js";
import { isErrorWithStds } from "../guards.js";
export default class GitDatabase {
    repoPath;
    constructor(repoPath) {
        this.repoPath = repoPath;
        this.cleanInit();
    }
    cleanInit() {
        createFolder(this.repoPath);
        const initOutput = execSync("git init .", { cwd: this.repoPath }).toString();
        console.log("Git repository initialized ", initOutput);
        execSync("git reset --hard", { cwd: this.repoPath }).toString();
        const cleanOutput = execSync("git clean -d -x -f", { cwd: this.repoPath }).toString();
        console.log("Git repository cleaned ", cleanOutput);
    }
    commit(blockNumber) {
        const addOutput = execSync("git add --all", { cwd: this.repoPath }).toString();
        console.log("Git repository added files ", addOutput);
        try {
            execSync(`git commit -m "${blockNumber}"`, { cwd: this.repoPath }).toString();
        }
        catch (error) {
            if (isErrorWithStds(error)) {
                console.log(error.stdout.toString());
                if (error.status !== 1) {
                    throw error;
                }
            }
        }
    }
    reset() {
        const resetOutput = execSync("git reset --hard", { cwd: this.repoPath }).toString();
        console.log("Git repository reset", resetOutput);
    }
}
//# sourceMappingURL=db-git.js.map