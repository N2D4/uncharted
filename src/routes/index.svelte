<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import LoadingSpinner from '../components/LoadingSpinner.svelte';
	import SourceManager from '../components/SourceManager.svelte';
	import { onMount } from 'svelte';
	import Separator from '../components/Separator.svelte';
	import type { EvalResult } from '../utils/ts-compiler';
	import ParameterEditor from '../components/ParameterEditor.svelte';
	import { getDefaultValue, Parameter, ParameterValue } from '../utils/parameters';
	import { throwErr } from '../utils/utils';

	type Data = Readonly<{ source: string; parameterValues: Record<string, ParameterValue> }>;
	let data: Data | null = null;
	let dataWriter: ((data: Data) => void) | null = null;
	$: data && dataWriter && dataWriter(data);

	type Settings = Readonly<{ autoFormat: boolean; disableSecurityConfirmation: boolean }>;
	let settings: Settings | null = null;
	let settingsWriter: ((settings: Settings) => void) | null = null;
	$: settings && settingsWriter && settingsWriter(settings);

	let evalResult: EvalResult | null = null;
	function onSourceSaved(newEvalResult: EvalResult) {
		evalResult = newEvalResult;

		if (!data)
			throwErr(`Data must be initialized before saving the source! (How did this happen?)`);

		const parameterValues = Object.create(null);
		for (const parameter of evalResult.results) {
			parameterValues[parameter.name] =
				data?.parameterValues[parameter.name] ?? getDefaultValue(parameter);
		}

		data = { ...data, parameterValues };
	}

	function getParameterValues(data: Data, evalResult: EvalResult) {
		return new Map(
			evalResult.parameters.map((parameter) => {
				const value = data.parameterValues[parameter.name] ?? getDefaultValue(parameter);
				return [parameter, value];
			})
		);
	}

	function updateParameterValue(data: Data, parameter: Parameter, value: ParameterValue) {
		return { ...data, parameterValues: { ...data.parameterValues, [parameter.name]: value } };
	}

	// Read data & storage
	onMount(() => {
		const localStorageDataKey = '@n2d4/uncharted/v1/data';
		data = JSON.parse(localStorage.getItem(localStorageDataKey) ?? `{}`);
		data = {
			source: `${
				data?.source ??
				`
(x: number, y: number, z: string) => {
    const xSquared = x ** 2;
    return {
        xSquaredHalf: xSquared / 2,
        complicatedCalculation: xSquared - y * z.length,
    };
}
			`.trim()
			}`,
			parameterValues: Object.assign(Object.create(null), data?.parameterValues ?? {})
		};
		dataWriter = (data) => localStorage.setItem(localStorageDataKey, JSON.stringify(data));

		const localStorageSettingsKey = '@n2d4/uncharted/v1/settings';
		settings = JSON.parse(localStorage.getItem(localStorageSettingsKey) ?? `{}`);
		settings = {
			autoFormat: !!(settings?.autoFormat ?? true),
			disableSecurityConfirmation: !!settings?.disableSecurityConfirmation
		};
		settingsWriter = (settings) =>
			localStorage.setItem(localStorageSettingsKey, JSON.stringify(settings));
	});

	// Aid debugging
	(globalThis as any)[`@n2d4/uncharted`] = {
		disableSecurityConfirmation: () =>
			(settings &&= { ...settings, disableSecurityConfirmation: true })
	};
</script>

<svelte:head>
	<title>Uncharted</title>
</svelte:head>

<h1>Uncharted</h1>

{#if data && settings}
	<SourceManager
		initialSource={data.source}
		on:saveSource={(event) => (data &&= { ...data, source: event.detail })}
		on:sourceUpdate={(event) => onSourceSaved(event.detail)}
		autoFormat={settings.autoFormat}
		on:changeAutoFormat={(event) => (settings &&= { ...settings, autoFormat: event.detail })}
		disableSecurityConfirmation={settings.disableSecurityConfirmation}
	/>

	{#if evalResult}
		<Separator />

		<h2>Parameters</h2>

		<ParameterEditor
			parameters={getParameterValues(data, evalResult)}
			on:changeParameter={(e) => (data &&= updateParameterValue(data, e.detail[0], e.detail[1]))}
		/>

		<Separator />

		<h2>Result</h2>
	{/if}
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
