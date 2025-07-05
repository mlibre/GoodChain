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