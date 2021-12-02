<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import LoadingSpinner from '../components/LoadingSpinner.svelte';
	import SourceManager from '../components/SourceManager.svelte';
	import { onMount } from 'svelte';
	import Separator from '../components/Separator.svelte';

	type Data = Readonly<{ source: string }>;
	let data: Data | null = null;
	let dataWriter: ((data: Data) => void) | null = null;

	type Settings = Readonly<{ autoFormat: boolean }>;
	let settings: Settings | null = null;
	let settingsWriter: ((settings: Settings) => void) | null = null;

	onMount(() => {
		const localStorageDataKey = '@n2d4/uncharted/v1/data';
		const localStorageData = localStorage.getItem(localStorageDataKey);
		data = JSON.parse(localStorage.getItem(localStorageDataKey) ?? `{}`);
		data = {
			source: `${data?.source ?? `(x: number, y: number) => {\n\tconst xSquared = x ** 2;\n\treturn xSquared - y;\n}`}`,
		};
		dataWriter = (data) => localStorage.setItem(localStorageDataKey, JSON.stringify(data));

		// Make sure data isn't corrupt
		data = {
			source: `${data?.source}`,
		};

		const localStorageSettingsKey = '@n2d4/uncharted/v1/settings';
		settings = JSON.parse(localStorage.getItem(localStorageSettingsKey) ?? `{}`);
		settings = {
			autoFormat: !!(settings?.autoFormat ?? true),
		};
		settingsWriter = (settings) =>
			localStorage.setItem(localStorageSettingsKey, JSON.stringify(settings));

		// Make sure settings aren't corrupt
	});

	$: data && dataWriter && dataWriter(data);
	$: settings && settingsWriter && settingsWriter(settings);
</script>

<svelte:head>
	<title>Uncharted</title>
</svelte:head>

<h1>Uncharted</h1>

{#if data && settings}
	<SourceManager
		initialSource={data.source}
		on:saveSource={(event) => (data = { ...data, source: event.detail })}
		on:sourceUpdate={(event) => alert(JSON.stringify(event.detail))}
		autoFormat={settings.autoFormat}
		on:changeAutoFormat={(event) => (settings = { ...settings, autoFormat: event.detail })}
	/>

	<Separator />

	<h2>Parameters</h2>

	<Separator />

	<h2>Result</h2>
{:else}
	<div class="loading-container">
		<LoadingSpinner fadeInAfter={250} />
	</div>
{/if}

<style>
	h1 {
		align-self: center;
	}

	h2 {
		align-self: center;
		margin: 0;
	}

	.loading-container {
		align-self: center;
		margin-top: 12px;
		margin-bottom: 32px;
	}
</style>
