export type Parameter = { name: string; type: readonly ['number'] | readonly ['string'] };

export type ParameterValue =
	| readonly ['literal', number | string]
	| readonly ['number-range', number, number];

export function getDefaultValue(parameter: Parameter): ParameterValue {
	switch (parameter.type[0]) {
		case 'number': {
			return ['literal', 0];
		}
		case 'string': {
			return ['literal', ''];
		}
	}
}

export function isValidValueForParameter(parameter: Parameter, value: ParameterValue): boolean {
	switch (parameter.type[0]) {
		case 'number': {
			return (
				value[0] === 'number-range' || (value[0] === 'literal' && typeof value[1] === 'number')
			);
		}
		case 'string': {
			return value[0] === 'literal' && typeof value[1] === 'string';
		}
	}
}
