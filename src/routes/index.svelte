<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import Button from '../components/Button.svelte';
	import { onMount } from 'svelte';
	import CodeEditor from '../components/CodeEditor.svelte';
	import Separator from '../components/Separator.svelte';
	import { compileTypeScript } from '../utils/ts-compiler';

	let source: string | null = null;

	function onUpdate() {
		if (!source) return alert(`Please enter some source code`);
		alert(JSON.stringify(compileTypeScript(source)));
	}
</script>

<svelte:head>
	<title>Uncharted</title>
</svelte:head>

<h1>Uncharted</h1>

<CodeEditor bind:value={source} />

<Button disabled={!source} on:click={onUpdate} />

<Separator />

<h2>Parameters</h2>

<Separator />

<h2>Result</h2>

<style>
	h1 {
		align-self: center;
	}

	h2 {
		align-self: center;
		margin: 0;
	}
</style>
