import crypto from "crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, unlinkSync, writeFileSync } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
export function calculateMiningFee(transactionPool) {
    return transactionPool.reduce((totalFee, transaction) => {
        return totalFee + transaction.fee;
    }, 0);
}
export function computeHash(data) {
    const stringData = JSON.stringify(data);
    return crypto
        .createHash("sha256")
        .update(stringData)
        .digest("hex");
}
export function objectify(data) {
    return JSON.parse(JSON.stringify(data));
}
export function initJsonFile(filePath, defaultData = {}) {
    const folderPath = path.dirname(filePath);
    if (!existsSync(folderPath)) {
        mkdirSync(folderPath, { recursive: true });
    }
    if (existsSync(filePath)) {
        return JSON.parse(readFileSync(filePath, "utf8"));
    }
    else {
        writeFileSync(filePath, JSON.stringify(defaultData, null, "\t"));
        return defaultData;
    }
}
export function updateFile(filePath, data) {
    writeFileSync(filePath, JSON.stringify(data, null, "\t"));
}
export function deleteFile(filePath) {
    try {
        if (existsSync(filePath)) {
            unlinkSync(filePath);
            console.log(`File ${filePath} Deleted`);
        }
        else {
            console.log(`${filePath} does not exist.`);
        }
    }
    catch (error) {
        console.error(`Error deleting ${filePath}:`, error);
    }
}
export function deleteFolder(folderPath) {
    if (existsSync(folderPath)) {
        rmSync(folderPath, { recursive: true, force: true });
    }
}
export function createFolder(folderPath) {
    if (!existsSync(folderPath)) {
        mkdirSync(folderPath);
        console.log(`Folder ${folderPath} Created`);
        return true;
    }
    else {
        console.warn(`Folder ${folderPath} already exists`);
        return false;
    }
}
export function generateUuid() {
    return uuidv4();
}
export function removePublicKeyHeaders(publicKey) {
    const headerRegex = /^-----BEGIN PUBLIC KEY-----\r?\n/;
    const footerRegex = /\n-----END PUBLIC KEY-----/;
    const strippedPublicKey = publicKey.replace(headerRegex, "");
    return strippedPublicKey.replace(footerRegex, "");
}
export function generateFilePath(folderPath, ...params) {
    return path.join(folderPath, ...params);
}
//# sourceMappingURL=utils.js.map