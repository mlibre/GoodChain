import { AxiosError } from "axios";
import _ from "lodash";
export function isEqualBlock(block1, block2) {
    return _.isEqual(block1, block2);
}
export function parseUrl(url) {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol.replace(":", "");
    const host = urlObj.hostname;
    const { port } = urlObj;
    return { host, port, protocol };
}
export function toNum(value) {
    return Number(value);
}
export function convertErrorToSimpleObj(err) {
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
export function axiosErrorHandling(error, data) {
    if (error instanceof AxiosError) {
        console.error(`Error fetching data from node ${data}:`, error.code, error.message, error?.response?.data);
    }
    else {
        console.error("Error:", error);
    }
}
//# sourceMappingURL=utils.js.map