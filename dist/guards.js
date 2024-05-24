export function isErrorWithStds(error) {
    return (typeof error === "object" &&
        error !== null &&
        "stderr" in error &&
        "stdout" in error &&
        "status" in error);
}
//# sourceMappingURL=guards.js.map