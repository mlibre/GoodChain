"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isErrorWithStds = void 0;
function isErrorWithStds(error) {
    return (typeof error === "object" &&
        error !== null &&
        "stderr" in error &&
        "stdout" in error &&
        "status" in error);
}
exports.isErrorWithStds = isErrorWithStds;
//# sourceMappingURL=guards.js.map