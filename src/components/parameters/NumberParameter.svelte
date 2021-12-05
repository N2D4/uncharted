<script context="module">
	let instanceCount = 0;
</script>

<script lang="ts">
	import type { Parameter, ParameterValue } from 'src/utils/parameters';
	import { createEventDispatcher } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';
	import InlineParameter from './InlineParameter.svelte';

	export let parameter: Parameter;
	export let initialValue: ParameterValue;

	const inputId = uuidv4();

	let value = initialValue[1];
	const instanceId = instanceCount++;
	const dispatch = createEventDispatcher();
</script>

<InlineParameter {parameter} inputId={inputId}>
	<input
		type="number"
		id={`n2d4-uncharted-numberparameter-${instanceId}`}
		bind:value
		on:change={() => dispatch('change', ["literal", +value])}
	/>
</InlineParameter>

<style>
	input {
		flex: 1 1 0;
	}
</style>
