<!-- Gracefully taken from https://loading.io/css/ (CC0) -->
<script lang="ts">
	export let disabled = false;
</script>

<button {disabled} on:click> <slot /> </button>

<style>
	button {
		align-self: flex-end;

		-webkit-appearance: none;
		appearance: none;
		background-color: #40bb20;
		color: white;
		border: none;
		border-radius: 10px;
		padding: 8px 32px 8px 32px;
		font-size: 120%;
		margin: 0;
	}

	button[disabled] {
		background-color: #888;
	}

	button:active {
		box-shadow: inset 0 0 25px rgba(0, 0, 0, 0.25);
	}
</style>
