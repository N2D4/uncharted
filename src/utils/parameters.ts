import { throwErr } from './utils';

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

	throwErr(
		`Can't find default value for type of ${parameter.name}: ${JSON.stringify(parameter.type)}`
	);
}
