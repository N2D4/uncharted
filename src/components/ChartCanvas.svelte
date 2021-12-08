<script lang="ts">
	import { iterablesEqual, throwErr } from '../utils/utils';
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';

	const colors = [
		'red',
		'blue',
		'green',
		// 'yellow', // yellow doesn't work well with the background
		'orange',
		'purple',
		'brown',
		'pink',
		'grey',
		'black'
	];

	export let xTitle: string;
	export let data: [number, Map<string, number>][];

	let canvas: HTMLCanvasElement | null = null;
	let chart: Chart<'line', { x: number; y: number | null }[]> | null = null;

	$: {
		if (!chart) break $;

		const results = [...new Set(data.flatMap((d) => [...d[1].keys()]))];
		chart.data.datasets = results.map((result, i) => ({
			label: result,
			data: data.map(([x, map]) => ({ x, y: map.get(result) ?? null })),
			borderWidth: 1,
			borderColor: colors[i % colors.length],
			cubicInterpolationMode: 'monotone',
			tension: 0.4
		}));
		chart.update();
	}

	onMount(() => {
		if (canvas === null) {
			throwErr('Assertion error: Canvas not found');
		}

		const ctx = canvas.getContext('2d') ?? throwErr(`Can't create canvas context`);
		chart = new Chart(ctx, {
			type: 'line',
			data: {
				datasets: []
			},
			options: {
				scales: {
					x: {
						type: 'linear',
						title: {
							display: true,
							text: xTitle
						}
					},
					y: {
						beginAtZero: true
					}
				},
				maintainAspectRatio: false
			}
		});
	});
</script>

<div class="cont">
	<div class="canvas-container">
		<canvas bind:this={canvas} />
	</div>
</div>

<style>
	.cont {
		position: relative;
		padding-bottom: calc(min(75%, 80vh));
		box-sizing: border-box;
	}

	.canvas-container {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
</style>
