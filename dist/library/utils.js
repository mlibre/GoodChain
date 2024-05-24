"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFilePath = exports.removePublicKeyHeaders = exports.generateUuid = exports.createFolder = exports.deleteFolder = exports.deleteFile = exports.updateFile = exports.initJsonFile = exports.objectify = exports.computeHash = exports.calculateMiningFee = void 0;
const tslib_1 = require("tslib");
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const fs_1 = require("fs");
const path_1 = tslib_1.__importDefault(require("path"));
const uuid_1 = require("uuid");
function calculateMiningFee(transactionPool) {
    return transactionPool.reduce((totalFee, transaction) => {
        return totalFee + transaction.fee;
    }, 0);
}
exports.calculateMiningFee = calculateMiningFee;
function computeHash(data) {
    const stringData = JSON.stringify(data);
    return crypto_1.default
        .createHash("sha256")
        .update(stringData)
        .digest("hex");
}
exports.computeHash = computeHash;
function objectify(data) {
    return JSON.parse(JSON.stringify(data));
}
exports.objectify = objectify;
function initJsonFile(filePath, defaultData = {}) {
    const folderPath = path_1.default.dirname(filePath);
    if (!(0, fs_1.existsSync)(folderPath)) {
        (0, fs_1.mkdirSync)(folderPath, { recursive: true });
    }
    if ((0, fs_1.existsSync)(filePath)) {
        return JSON.parse((0, fs_1.readFileSync)(filePath, "utf8"));
    }
    else {
        (0, fs_1.writeFileSync)(filePath, JSON.stringify(defaultData, null, "\t"));
        return defaultData;
    }
}
exports.initJsonFile = initJsonFile;
function updateFile(filePath, data) {
    (0, fs_1.writeFileSync)(filePath, JSON.stringify(data, null, "\t"));
}
exports.updateFile = updateFile;
function deleteFile(filePath) {
    try {
        if ((0, fs_1.existsSync)(filePath)) {
            (0, fs_1.unlinkSync)(filePath);
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
exports.deleteFile = deleteFile;
function deleteFolder(folderPath) {
    if ((0, fs_1.existsSync)(folderPath)) {
        (0, fs_1.rmSync)(folderPath, { recursive: true, force: true });
    }
}
exports.deleteFolder = deleteFolder;
function createFolder(folderPath) {
    if (!(0, fs_1.existsSync)(folderPath)) {
        (0, fs_1.mkdirSync)(folderPath);
        console.log(`Folder ${folderPath} Created`);
        return true;
    }
    else {
        console.warn(`Folder ${folderPath} already exists`);
        return false;
    }
}
exports.createFolder = createFolder;
function generateUuid() {
    return (0, uuid_1.v4)();
}
exports.generateUuid = generateUuid;
function removePublicKeyHeaders(publicKey) {
    const headerRegex = /^-----BEGIN PUBLIC KEY-----\r?\n/;
    const footerRegex = /\n-----END PUBLIC KEY-----/;
    const strippedPublicKey = publicKey.replace(headerRegex, "");
    return strippedPublicKey.replace(footerRegex, "");
}
exports.removePublicKeyHeaders = removePublicKeyHeaders;
function generateFilePath(folderPath, ...params) {
    return path_1.default.join(folderPath, ...params);
}
exports.generateFilePath = generateFilePath;
//# sourceMappingURL=utils.js.map