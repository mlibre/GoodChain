"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.axiosErrorHandling = exports.convertErrorToSimpleObj = exports.toNum = exports.parseUrl = exports.isEqualBlock = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("axios");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
function isEqualBlock(block1, block2) {
    return lodash_1.default.isEqual(block1, block2);
}
exports.isEqualBlock = isEqualBlock;
function parseUrl(url) {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol.replace(":", "");
    const host = urlObj.hostname;
    const { port } = urlObj;
    return { host, port, protocol };
}
exports.parseUrl = parseUrl;
function toNum(value) {
    return Number(value);
}
exports.toNum = toNum;
function convertErrorToSimpleObj(err) {
    if (err.isAxiosError) {
        delete err.config;
        delete err.request;
    }
    const simpleErr = {};
    if (err.message) {
        simpleErr.message = err.message;
    }
    if (err.stack) {
        simpleErr.stack = err.stack;
    }
    for (const key of Object.getOwnPropertyNames(err)) {
        if (err[key] && (err[key] instanceof Error || typeof err[key] === "object")) {
            simpleErr[key] = convertErrorToSimpleObj(err[key]);
        }
        else {
            simpleErr[key] = err[key];
        }
    }
    return simpleErr;
}
exports.convertErrorToSimpleObj = convertErrorToSimpleObj;
function axiosErrorHandling(error, data) {
    if (error instanceof axios_1.AxiosError) {
        console.error(`Error fetching data from node ${data}:`, error.code, error.message, error?.response?.data);
    }
    else {
        console.error("Error:", error);
    }
}
exports.axiosErrorHandling = axiosErrorHandling;
//# sourceMappingURL=utils.js.map