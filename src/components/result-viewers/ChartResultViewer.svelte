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

	let mostRecentDataProcessingId = 0;
	let processedData: {
		parameter: Parameter;
		data: [number, Map<string, number>][];
	} | null = null;

	async function processData(
		results: Result[],
		parameters: Map<Parameter, ParameterValue>,
		func: EvalFunction
	) {
		const processingId = ++mostRecentDataProcessingId;
		let newData = null;
		try {
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

					if (mostRecentDataProcessingId !== processingId) return;
				} catch (e) {
					console.error(`Error evaluating chart data`, { parameters, error: e, func });
				}
			}

			newData = { parameter: computeParameter, data };
		} finally {
			if (mostRecentDataProcessingId === processingId) processedData = newData;
		}
	}
</script>

<div class="cont">
	{#if processedData}
		<ChartCanvas
			data={processedData.data}
			xTitle={getHumanReadableName(processedData.parameter.name)}
		/>
	{/if}

	{#await processData(results, parameters, func)}
		{#if processedData}
			<div class="loading-prevent-click">
				<LoadingSpinner />
			</div>
		{:else}
			<div class="loading-cont">
				<LoadingSpinner fadeInAfter={250} />
			</div>
		{/if}
	{:catch error}
		<div class="error">{`${error}`}</div>
	{/await}
</div>

<style>
	.cont {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: stretch;

		position: relative;
	}

	.loading-prevent-click {
		position: absolute;
		z-index: 999;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.loading-cont {
		padding-top: 16px;
	}

	.error {
		color: red;
	}
</style>
