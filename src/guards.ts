export function isErrorWithStds ( error: unknown ): error is ErrorWithStdsOutErr
{
	return (
		typeof error === "object" &&
		error !== null &&
		"stderr" in error &&
		"stdout" in error &&
	  "status" in error
	);
}

export function isLevelNotFoundError ( error: unknown ): error is LevelNotFoundError
{
	return (
		typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "notFound" in error &&
    "status" in error
	);
}