<!-- Gracefully taken from https://loading.io/css/ (CC0) -->
<script lang="ts">
	export let disabled = false;
	export let primary = false;
</script>

<button {disabled} on:click class:primary> <slot /> </button>

<style>
	button {
		-webkit-appearance: none;
		appearance: none;
		color: white;
		background-color: #888;
		border: none;
		border-radius: 10px;
		padding: 8px 32px 8px 32px;
		font-size: 120%;
		margin: 0;
	}
	
	button.primary {
		background-color: #4b2;
	}
	
	button.primary[disabled] {
		background-color: #cda;
	}

	button[disabled] {
		background-color: #ccc;
	}

	button:active:not([disabled]) {
		box-shadow: inset 0 0 25px rgba(0, 0, 0, 0.25);
	}
</style>
