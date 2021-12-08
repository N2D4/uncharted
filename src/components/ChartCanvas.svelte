<script lang="ts">
	import { prettyToString, throwErr } from '../utils/utils';
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';

	const colors = [
		'red',
		'blue',
		'green',
		'yellow',
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
				}
			}
		});
	});
</script>

<canvas bind:this={canvas} />

<style>
</style>
