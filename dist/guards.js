export function isErrorWithStds(error) {
    return (typeof error === "object" &&
        error !== null &&
        "stderr" in error &&
        "stdout" in error &&
        "status" in error);
}
export function isLevelNotFoundError(error) {
    return (typeof error === "object" &&
        error !== null &&
        "code" in error &&
        "notFound" in error &&
        "status" in error);
}
//# sourceMappingURL=guards.js.map