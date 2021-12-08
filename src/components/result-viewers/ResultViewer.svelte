<script lang="ts">
	import type { Result } from '../../utils/results';
	import TableResultViewer from './TableResultViewer.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { Parameter, ParameterValue } from '../../utils/parameters';
    import type { EvalFunction } from '../../utils/ts-compiler';
import ChartResultViewer from './ChartResultViewer.svelte';

	export let results: Result[];
	export let parameters: Map<Parameter, ParameterValue>;
	export let resultViewer: string;
    export let func: EvalFunction;

	const dispatch = createEventDispatcher();
</script>

<select bind:value={resultViewer} on:change={(e) => dispatch('changeResultViewer', resultViewer)}>
	<option value="table"> Table </option>
	<option value="chart"> Chart </option>
</select>

{#if resultViewer === 'table'}
	<TableResultViewer {results} {parameters} {func} />
{:else if resultViewer === 'chart'}
	<ChartResultViewer {results} {parameters} {func} />
{:else}
	<div>Please choose a result viewer.</div>
{/if}

<style>
	select {
		padding: 4px 8px 4px 8px;
		border-radius: 10px;
		font: inherit;
	}
</style>
