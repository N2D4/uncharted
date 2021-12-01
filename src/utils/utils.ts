export function throwErr(err: string | Error): never {
    if (typeof err === 'string') {
        err = new Error(err);
    }
    throw err;
}
