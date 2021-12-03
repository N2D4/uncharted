export function throwErr(err: string | Error, ...args: unknown[]): never {
	if (typeof err === 'string') {
		err = new Error(err);
	}
	console.error(err, args);
	throw err;
}
