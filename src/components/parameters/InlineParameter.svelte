<script lang="ts">
	import type { Parameter } from '../../utils/parameters';
	import { getHumanReadableName } from '../../utils/utils';
	import { createEventDispatcher } from 'svelte';
	import ParameterSeparator from './ParameterSeparator.svelte';
	import rangeIcon from '../../../static/range-icon.png';

	export let inputId: string | undefined = undefined;
	export let parameter: Parameter;
	export let type: 'value' | 'range' = 'value';
	export let showRange = false;

	const dispatch = createEventDispatcher();
</script>

<label for={inputId}>{getHumanReadableName(parameter.name)}</label>
<div>
	{#if type === 'value'}
		<slot />
	{:else if type === 'range'}
		<!-- Thank you to Adrian Coquet for this CC-by icon -->
		<img
			class="range-icon"
			class:activated={showRange}
			on:click={(e) => dispatch('changeShowRange', (showRange = !showRange))}
			src={rangeIcon}
			alt="Enable or disable ranges"
			width="28px"
			height="28px"
		/>
		<ParameterSeparator />
		<slot />
	{/if}
</div>

<style>
	label {
		grid-column: 1 / span 1;
		white-space: nowrap;
	}

	div {
		grid-column: 2 / span 1;

		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: stretch;
		height: 36px;

		background-color: white;
		border: 1px solid black;
		border-radius: 10px;
		box-sizing: border-box;
		overflow: hidden;
	}

	.range-icon {
		padding: 4px;
		align-self: center;
		margin: 0px;
	}

	.range-icon.activated {
		background-color: rgba(255, 0, 0, 0.3);
	}

	.range-icon:active {
		background-color: rgba(0, 0, 0, 0.2);
	}
</style>
