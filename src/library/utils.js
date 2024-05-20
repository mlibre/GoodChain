"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFilePath = exports.removePublicKeyHeaders = exports.createKeyPair = exports.generateUuid = exports.createFolder = exports.deleteFolder = exports.deleteFile = exports.updateFile = exports.initJsonFile = exports.objectify = exports.hashDataObject = exports.calculateMiningFee = void 0;
var crypto_1 = require("crypto");
var fs_1 = require("fs");
var path_1 = require("path");
var uuid_1 = require("uuid");
function calculateMiningFee(transactionPool) {
    return transactionPool.reduce(function (totalFee, transaction) {
        return totalFee + transaction.fee;
    }, 0);
}
exports.calculateMiningFee = calculateMiningFee;
function hashDataObject(data) {
    var stringData = JSON.stringify(data);
    return crypto_1.default
        .createHash("sha256")
        .update(stringData)
        .digest("hex");
}
exports.hashDataObject = hashDataObject;
function objectify(data) {
    return JSON.parse(JSON.stringify(data));
}
exports.objectify = objectify;
function initJsonFile(filePath, defaultData) {
    if (defaultData === void 0) { defaultData = {}; }
    var folderPath = path_1.default.dirname(filePath);
    if (!fs_1.default.existsSync(folderPath)) {
        fs_1.default.mkdirSync(folderPath, { recursive: true });
    }
    if (fs_1.default.existsSync(filePath)) {
        return JSON.parse(fs_1.default.readFileSync(filePath, "utf8"));
    }
    else {
        fs_1.default.writeFileSync(filePath, JSON.stringify(defaultData, null, "\t"));
        return defaultData;
    }
}
exports.initJsonFile = initJsonFile;
function updateFile(filePath, data) {
    fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, "\t"));
}
exports.updateFile = updateFile;
function deleteFile(filePath) {
    try {
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
            console.log("File ".concat(filePath, " Deleted"));
        }
        else {
            console.log("".concat(filePath, " does not exist."));
        }
    }
    catch (error) {
        console.error("Error deleting ".concat(filePath, ":"), error);
    }
}
exports.deleteFile = deleteFile;
function deleteFolder(folderPath) {
    if (fs_1.default.existsSync(folderPath)) {
        fs_1.default.rmdirSync(folderPath, { recursive: true });
    }
}
exports.deleteFolder = deleteFolder;
function createFolder(folderPath) {
    if (!fs_1.default.existsSync(folderPath)) {
        fs_1.default.mkdirSync(folderPath);
        console.log("Folder ".concat(folderPath, " Created"));
        return true;
    }
    else {
        console.log("Folder ".concat(folderPath, " already exists"));
        return false;
    }
}
exports.createFolder = createFolder;
function generateUuid() {
    return (0, uuid_1.v4)();
}
exports.generateUuid = generateUuid;
function createKeyPair() {
    var keyPair = crypto_1.default.generateKeyPairSync("ed25519");
    var publicKey = keyPair.publicKey.export({ type: "spki", format: "pem" }).toString();
    var privateKey = keyPair.privateKey.export({ type: "pkcs8", format: "pem" }).toString();
    var publicKeyString = removePublicKeyHeaders(publicKey);
    return { publicKey: publicKey, privateKey: privateKey, publicKeyString: publicKeyString };
}
exports.createKeyPair = createKeyPair;
function removePublicKeyHeaders(publicKey) {
    var headerRegex = /^-----BEGIN PUBLIC KEY-----\r?\n/;
    var footerRegex = /\n-----END PUBLIC KEY-----/;
    var strippedPublicKey = publicKey.replace(headerRegex, "");
    return strippedPublicKey.replace(footerRegex, "");
}
exports.removePublicKeyHeaders = removePublicKeyHeaders;
function makeFilePath(folderPath) {
    var params = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        params[_i - 1] = arguments[_i];
    }
    return path_1.default.join.apply(path_1.default, __spreadArray([folderPath], params, false));
}
exports.makeFilePath = makeFilePath;
