<!-- Gracefully taken from https://loading.io/css/ (CC0) -->
<script lang="ts">
	import { onMount } from 'svelte';

	export let text = '';
	export let fadeInAfter: number | null = null;

	let visible = fadeInAfter === null;
	onMount(() => {
		if (fadeInAfter !== null) setTimeout(() => (visible = true), fadeInAfter);
	});
</script>

<div class="cont" class:visible>
	<div class="lds-grid">
		<div />
		<div />
		<div />
		<div />
		<div />
		<div />
		<div />
		<div />
		<div />
	</div>
	{text}
</div>

<style>
	.cont {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		opacity: 0;
		transition: 0.5s opacity;
	}

	.cont.visible {
		opacity: 1;
	}

	.lds-grid {
		display: inline-block;
		position: relative;
		width: 80px;
		height: 80px;
	}

	.lds-grid div {
		position: absolute;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #111;
		background: currentColor;
		animation: lds-grid 1.2s linear infinite;
	}
	.lds-grid div:nth-child(1) {
		top: 8px;
		left: 8px;
		animation-delay: 0s;
	}
	.lds-grid div:nth-child(2) {
		top: 8px;
		left: 32px;
		animation-delay: -0.4s;
	}
	.lds-grid div:nth-child(3) {
		top: 8px;
		left: 56px;
		animation-delay: -0.8s;
	}
	.lds-grid div:nth-child(4) {
		top: 32px;
		left: 8px;
		animation-delay: -0.4s;
	}
	.lds-grid div:nth-child(5) {
		top: 32px;
		left: 32px;
		animation-delay: -0.8s;
	}
	.lds-grid div:nth-child(6) {
		top: 32px;
		left: 56px;
		animation-delay: -1.2s;
	}
	.lds-grid div:nth-child(7) {
		top: 56px;
		left: 8px;
		animation-delay: -0.8s;
	}
	.lds-grid div:nth-child(8) {
		top: 56px;
		left: 32px;
		animation-delay: -1.2s;
	}
	.lds-grid div:nth-child(9) {
		top: 56px;
		left: 56px;
		animation-delay: -1.6s;
	}
	@keyframes lds-grid {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}
</style>
