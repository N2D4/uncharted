<script lang="ts">
	import type { Parameter, ParameterValue } from 'src/utils/parameters';
	import { createEventDispatcher } from 'svelte';
	import NumberParameter from './NumberParameter.svelte';
	import StringParameter from './StringParameter.svelte';

	export let parameters: Map<Parameter, ParameterValue>;

	const dispatch = createEventDispatcher();
</script>

<div class="grid">
	{#each [...parameters] as parameter (parameter[0].name)}
		{#if parameter[0].type[0] === 'number'}
			<NumberParameter
				parameter={parameter[0]}
				initialValue={parameter[1]}
				on:change={(e) => dispatch('change', [parameter[0], e.detail])}
			/>
		{:else if parameter[0].type[0] === 'string'}
			<StringParameter
				parameter={parameter[0]}
				initialValue={parameter[1]}
				on:change={(e) => dispatch('change', [parameter[0], e.detail])}
			/>
		{:else}
			<div class="error">
				ERROR: Unknown parameter type for {parameter[0].name}: {JSON.stringify(parameter[0].type)}
			</div>
		{/if}
	{/each}
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: min-content auto;
		column-gap: 16px;
		row-gap: 8px;

		justify-content: stretch;
		align-content: start;
		justify-items: stretch;
		align-items: center;
	}

	.error {
		color: red;
		font-weight: bold;
		grid-column: 1 / span 2;
	}
</style>
