export function throwErr(err: string | Error, ...args: unknown[]): never {
	if (typeof err === 'string') {
		err = new Error(err);
	}
	console.error(err, args);
	throw err;
}

export function getHumanReadableName(identifier: string): string {
	let name = identifier;
	if (name.length === 0) return name;
	if (!name.match(/^[a-zA-Z0-9_]*$/m)) return name;

	name = name.charAt(0).toUpperCase() + name.slice(1);
	name = name.replace(/(.)_+(.)/g, (_, s1, s2) => `${s1}${s2.toUpperCase()}`);
	name = name.replace(/_/g, '');
	name = name.replace(/(.)([0-9$])/g, '$1 $2');
	name = name.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
	name = name.replace(/([a-z0-9$])([A-Z])/g, '$1 $2');
	return name;
}

export function prettyToString(x: unknown) {
	return typeof x === 'number' ? x.toFixed(3) : `${x}`;
}

export function iterablesEqual<T>(
	iter1: Iterable<T>,
	iter2: Iterable<T>,
	comp: (a: T, b: T) => boolean = (a, b) => a === b
): boolean {
	const it1 = iter1[Symbol.iterator]();
	const it2 = iter2[Symbol.iterator]();
	// eslint-disable-next-line no-constant-condition
	while (true) {
		const next1 = it1.next();
		const next2 = it2.next();
		console.log({ next1, next2 });
		if (next1.done !== next2.done) return false;
		if (next1.done) return true;
		if (!comp(next1.value, next2.value)) return false;
	}
}
