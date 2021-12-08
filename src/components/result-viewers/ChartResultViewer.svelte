<script lang="ts">
	import type { Result } from '../../utils/results';
	import type { Parameter, ParameterValue } from '../../utils/parameters';
	import type { EvalFunction } from '../../utils/ts-compiler';
	import ChartCanvas from '../ChartCanvas.svelte';
	import { getHumanReadableName, throwErr } from '../../utils/utils';
	import LoadingSpinner from '../LoadingSpinner.svelte';

	export let results: Result[];
	export let parameters: Map<Parameter, ParameterValue>;
	export let func: EvalFunction;

	async function getData(results: Result[], parameters: Map<Parameter, ParameterValue>, func: EvalFunction) {
		// Make sure there's only one range parameter
		const computeParameters = [...parameters].flatMap(([param, value]) =>
			value[0] !== 'number-range' ? [] : ([[param, value]] as const)
		);
		if (computeParameters.length !== 1)
			throwErr(`Exactly one parameter must be set to range mode`);
		const computeParameter = computeParameters[0][0];

		// Compute range info
		const range = [computeParameters[0][1][1], computeParameters[0][1][2]];
		const stepCount = 25;
		const stepSize = (range[1] - range[0]) / (stepCount - 1);

		// Evaluate data points
		const data: [number, Map<string, number>][] = [];
		for (let i = 0; i < stepCount; i++) {
			const paramVal = range[0] + i * stepSize;

			const args = [...parameters].map(([parameter, value]) => {
				switch (value[0]) {
					case 'number-range':
						if (parameter !== computeParameter)
							throwErr(
								`Assertion error: There shouldn't be any unknown range parameters at this point`
							);
						return paramVal;
					case 'literal':
						return value[1];
					default:
						throw new Error(`Unknown parameter type ${value[0]}`);
				}
			});

			try {
				const resultRecord = await func(...args);
				data.push([
					paramVal,
					new Map(
						results.map((r) => [getHumanReadableName(r.name), resultRecord?.[r.name] ?? null])
					)
				]);
			} catch (e) {
				console.error(`Error evaluating chart data`, { parameters, error: e, func });
			}
		}

		return { parameter: computeParameter, data };
	}
</script>

{#await getData(results, parameters, func)}
	<LoadingSpinner fadeInAfter={250} />
{:then data}
	<ChartCanvas data={data.data} xTitle={getHumanReadableName(data.parameter.name)} />
{:catch error}
	<div class="error">{`${error}`}</div>
{/await}

<style>
	.error {
		color: red;
	}
</style>
