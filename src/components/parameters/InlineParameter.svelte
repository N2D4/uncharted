<script lang="ts">
	import type { Parameter } from "src/utils/parameters";


	export let inputId: string | undefined = undefined;
	export let parameter: Parameter;
</script>


<label for={inputId}>{parameter.name}</label>
<div>
	<slot />
</div>

<style>
	label {
		grid-column: 1 / span 1;

		justify-content: start;
		align-content: start;
		justify-items: start;
		align-items: center;
	}

	div {
		grid-column: 2 / span 1;

		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: center;
	}
</style>
