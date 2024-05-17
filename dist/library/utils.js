import crypto from "crypto";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
export function calculateMiningFee(transactionPool) {
    return transactionPool.reduce((totalFee, transaction) => {
        return totalFee + transaction.fee;
    }, 0);
}
export function hashDataObject(data) {
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
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
    else {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, "\t"));
        return defaultData;
    }
}
export function updateFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, "\t"));
}
export function deleteFile(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
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
    if (fs.existsSync(folderPath)) {
        fs.rmdirSync(folderPath, { recursive: true });
    }
}
export function createFolder(folderPath) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        console.log(`Folder ${folderPath} Created`);
        return true;
    }
    else {
        console.log(`Folder ${folderPath} already exists`);
        return false;
    }
}
export function generateUuid() {
    return uuidv4();
}
export function createKeyPair() {
    const keyPair = crypto.generateKeyPairSync("ed25519");
    const publicKey = keyPair.publicKey.export({ type: "spki", format: "pem" }).toString();
    const privateKey = keyPair.privateKey.export({ type: "pkcs8", format: "pem" }).toString();
    const publicKeyString = removePublicKeyHeaders(publicKey);
    return { publicKey, privateKey, publicKeyString };
}
export function removePublicKeyHeaders(publicKey) {
    const headerRegex = /^-----BEGIN PUBLIC KEY-----\r?\n/;
    const footerRegex = /\n-----END PUBLIC KEY-----/;
    const strippedPublicKey = publicKey.replace(headerRegex, "");
    return strippedPublicKey.replace(footerRegex, "");
}
export function makeFilePath(folderPath, ...params) {
    return path.join(folderPath, ...params);
}
//# sourceMappingURL=utils.js.map