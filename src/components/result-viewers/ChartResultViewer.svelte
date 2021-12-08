<script lang="ts">
	import type { Result } from '../../utils/results';
	import type { Parameter, ParameterValue } from '../../utils/parameters';
	import type { EvalFunction } from '../../utils/ts-compiler';
	import ChartCanvas from '../ChartCanvas.svelte';
	import { getHumanReadableName, throwErr } from '../../utils/utils';
import { stringify } from 'uuid';

	export let results: Result[];
	export let parameters: Map<Parameter, ParameterValue>;
	export let func: EvalFunction;

	let data: {
		error: null,
		parameter: Parameter;
		data: [number, Map<string, number>][];
	} | {
		error: string,
	} = {
		error: "Chart initialization error",
	};
	$: data = (() => {
		// Headers
		const computeParameters = [...parameters].flatMap(([param, value]) =>
			value[0] !== 'number-range' ? [] : ([[param, value]] as const)
		);
		if (computeParameters.length !== 1) return { error: `Exactly one numeric parameter must be set to range mode` };
		const computeParameter = computeParameters[0][0];

		const range = [computeParameters[0][1][1], computeParameters[0][1][2]];
		const stepCount = 10;
		const stepSize = (range[1] - range[0]) / (stepCount - 1);

		const data: [number, Map<string, number>][] = [];
		for (let i = 0; i < stepCount; i++) {
			const paramVal = range[0] + i * stepSize;

			const args = [...parameters].map(([parameter, value]) => {
				switch (value[0]) {
					case 'number-range':
						if (parameter !== computeParameter)
							throwErr(
								`Assertion error: There shouldn't be any number-rage parameters at this point`
							);
						return paramVal;
					case 'literal':
						return value[1];
					default:
						throw new Error(`Unknown parameter type ${value[0]}`);
				}
			});

			try {
				const resultRecord = func(...args);
				data.push([paramVal, new Map(results.map(r => [r.name, resultRecord?.[r.name] ?? null]))]);
			} catch (e) {
				console.error(`Error evaluating chart data`, { parameters, error: e, func });
			}

		}

		return { error: null, parameter: computeParameter, data };

		header = [computeParameters.map((x) => x[0]), results];

		// Rows
		const valuesPerParam =
			computeParameters.length === 0
				? 1
				: Math.min(10, Math.max(2, Math.floor(20 ** (1 / computeParameters.length))));
		const totalRows = valuesPerParam ** computeParameters.length;
		rows = new Array(totalRows).fill(0).map(() => [[], []]);
		for (let i = 0; i < totalRows; i++) {
			let j = i;
			const assignedParameters = new Map<Parameter, number>();
			for (const [parameter, value] of computeParameters) {
				const [_, min, max] = value;
				const step = (max - min) / (valuesPerParam - 1);
				const assignedValue = min + (j % valuesPerParam) * step;
				assignedParameters.set(parameter, assignedValue);
				rows[i][0].push(prettyToString(assignedValue));
				j = Math.floor(j / valuesPerParam);
			}

			const args = [...parameters].map(([parameter, value]) => {
				switch (value[0]) {
					case 'number-range':
						return assignedParameters.get(parameter)!;
					case 'literal':
						return value[1];
					default:
						throw new Error(`Unknown parameter type ${value[0]}`);
				}
			});
			try {
				const value = func(...args);

				for (const result of results) {
					rows[i][1].push(prettyToString(value?.[result.name]));
				}
			} catch (e) {
				console.error(`Error evaluating table`, { parameters, error: e, func });
				rows[i][1].push(e instanceof Error ? e.name : `error: ${e}`);
			}
		}
	})();
</script>

{#if data.error !== null}
	<div class="error">ERROR: {data.error}</div>
{:else}
	<ChartCanvas
		data={data.data}
		xTitle={getHumanReadableName(data.parameter.name)}
	/>
{/if}

<style>
	.error {
		color: red;
	}
</style>
