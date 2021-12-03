<script lang="ts">
	import type { Parameter, ParameterValue } from 'src/utils/parameters';
	import { createEventDispatcher } from 'svelte';
	import NumberParameter from './parameters/NumberParameter.svelte';

	export let parameters: Map<Parameter, ParameterValue>;

	const dispatch = createEventDispatcher();
</script>

{#each [...parameters] as parameter}
	{#if parameter[0].type[0] === 'number'}
		<NumberParameter
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

<style>
    .error {
        color: red;
        font-weight: bold;
    }
</style>
