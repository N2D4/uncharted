<script context="module">
	let instanceCount = 0;
</script>

<script lang="ts">
	import {
		getDefaultValue,
		isValidValueForParameter,
		Parameter,
		ParameterValue
	} from '../../utils/parameters';
	import { createEventDispatcher } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';
	import InlineParameter from './InlineParameter.svelte';
	import ParameterSeparator from './ParameterSeparator.svelte';

	export let parameter: Parameter;
	export let initialValue: ParameterValue;

	const inputId = uuidv4();
	const dispatch = createEventDispatcher();

	let value: ParameterValue = [...initialValue];
	function setValue(newValue: ParameterValue) {
		value = newValue;
		dispatch('change', value);
	}

	if (!isValidValueForParameter(parameter, value)) setValue(getDefaultValue(parameter));
</script>

<InlineParameter
	{parameter}
	{inputId}
	type="range"
	showRange={value[0] === 'number-range'}
	on:changeShowRange={(e) =>
		setValue(e.detail ? ['number-range', +value[1], +value[1] + 1] : ['literal', value[1]])}
>
	{#if value[0] === 'literal'}
		<input
			type="number"
			class="input_field"
			id={inputId}
			value={value[1]}
			on:change={(e) => setValue(['literal', +e.currentTarget.value])}
		/>
	{:else if value[0] === 'number-range'}
		<input
			type="number"
			class="input_field"
			id={inputId}
			value={value[1]}
			max={value[2]}
			on:change={(e) => setValue(['number-range', +e.currentTarget.value, value[2] ?? 0])}
		/>
		<ParameterSeparator />
		<input
			type="number"
			class="input_field"
			min={value[1]}
			value={value[2]}
			on:change={(e) => setValue(['number-range', +value[1], +e.currentTarget.value])}
		/>
	{/if}
</InlineParameter>

<style>
	.input_field {
		flex: 1 1 0;
		font: inherit;
		padding: 4px 8px 4px 8px;
		background-color: inherit;
		appearance: inherit;
		border: none;
		min-width: 0;
	}
</style>
