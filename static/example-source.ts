(x: number, y: number, z: string) => {
	const xSquared = x ** 2;
	return {
		xSquaredHalf: xSquared / 2,
		complicatedCalculation: xSquared - y * z.length
	};
};
