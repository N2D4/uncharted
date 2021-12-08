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
>
	<input
		type="text"
		class="input_field"
		placeholder="text value"
		id={inputId}
		value={value[1]}
		on:change={(e) => setValue(['literal', `${e.currentTarget.value}`])}
	/>
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
