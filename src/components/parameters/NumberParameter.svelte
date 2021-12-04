<script context="module">
	let instanceCount = 0;
</script>

<script lang="ts">
	import type { Parameter, ParameterValue } from 'src/utils/parameters';
	import { createEventDispatcher } from 'svelte';

	export let parameter: Parameter;
	export let initialValue: ParameterValue;

	let value = initialValue[1];
	const instanceId = instanceCount++;
	const dispatch = createEventDispatcher();
</script>

<div>
	<label for={`n2d4-uncharted-numberparameter-${instanceId}`}>{parameter.name}</label>
	<input
		type="number"
		id={`n2d4-uncharted-numberparameter-${instanceId}`}
		bind:value
		on:change={() => dispatch('change', ["literal", +value])}
	/>
</div>
