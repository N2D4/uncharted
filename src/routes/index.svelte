<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import LoadingSpinner from '../components/LoadingSpinner.svelte';
	import SourceManager from '../components/SourceManager.svelte';
	import { onMount } from 'svelte';
	import Separator from '../components/Separator.svelte';
	import type { EvalResult } from '../utils/ts-compiler';
	import ParameterEditor from '../components/parameters/ParameterEditor.svelte';
	import { getDefaultValue, Parameter, ParameterValue } from '../utils/parameters';
	import { throwErr } from '../utils/utils';
	import ResultViewer from '../components/result-viewers/ResultViewer.svelte';
	import exampleSource from '../../static/example-source.ts?raw';

	type Data = Readonly<{
		source: string;
		parameterValues: Record<string, ParameterValue>;
		selectedResultViewer: string;
	}>;
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
		for (const parameter of evalResult.parameters) {
			parameterValues[parameter.name] =
				data?.parameterValues[parameter.name] ?? getDefaultValue(parameter);
		}

		data = { ...data, parameterValues };
	}

	let getParameterValuesCache: [args: any[], result: any] | null = null;
	function getParameterValues(
		parameterValues: Record<string, ParameterValue>,
		evalResult: EvalResult
	) {
		// If we've already created a map for these parameter values, use that one so Svelte doesn't propagate an update
		// (that only works if Svelte's immutable option is true, if not Svelte will still propagate an update)
		if (
			getParameterValuesCache &&
			getParameterValuesCache[0][0] === parameterValues &&
			getParameterValuesCache[0][1] === evalResult
		) {
			return getParameterValuesCache[1];
		}

		const result = new Map(
			evalResult.parameters.map((parameter) => {
				const value = parameterValues[parameter.name] ?? getDefaultValue(parameter);
				return [parameter, value];
			})
		);

		getParameterValuesCache = [[parameterValues, evalResult], result];
		return result;
	}

	function updateParameterValue(data: Data, parameter: Parameter, value: ParameterValue) {
		return { ...data, parameterValues: { ...data.parameterValues, [parameter.name]: value } };
	}

	// Read data & storage
	onMount(() => {
		const localStorageDataKey = '@n2d4/uncharted/v1/data';
		data = JSON.parse(localStorage.getItem(localStorageDataKey) ?? `{}`);
		data = {
			source: `${data?.source ?? exampleSource}`,
			parameterValues: Object.assign(Object.create(null), data?.parameterValues ?? {}),
			selectedResultViewer: data?.selectedResultViewer ?? 'chart'
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

		<div class="section-container all-sections">
			<div class="section-container parameters-section">
				<h2>Parameters</h2>

				<ParameterEditor
					parameters={getParameterValues(data.parameterValues, evalResult)}
					on:change={(e) => (data &&= updateParameterValue(data, e.detail[0], e.detail[1]))}
				/>
			</div>

			<Separator />

			<div class="section-container results-section">
				<h2>Result</h2>

				<ResultViewer
					results={evalResult.results}
					parameters={getParameterValues(data.parameterValues, evalResult)}
					resultViewer={data.selectedResultViewer}
					func={evalResult.function}
					on:changeResultViewer={(e) => (data &&= { ...data, selectedResultViewer: e.detail })}
				/>
			</div>
		</div>
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
		margin-bottom: 8px;
	}

	.loading-container {
		align-self: center;
		margin-top: 12px;
		margin-bottom: 32px;
	}

	.section-container {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	@media only screen and (min-width: 1000px) {
		.results-section {
			flex: 1 1 0;
			min-width: 0;
		}

		.parameters-section {
			flex: 0 0 auto;
		}

		.all-sections {
			flex-direction: row;
		}
	}
</style>
