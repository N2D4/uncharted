<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import Button from '../components/Button.svelte';
	import CodeEditor from '../components/CodeEditor.svelte';
	import Separator from '../components/Separator.svelte';
	import { compileTypeScript } from '../utils/ts-compiler';

	let source: string | null = null;
	let hasConfirmedSecurity = false;
	let isCompiling = 0;

	async function onUpdate() {
		if (!hasConfirmedSecurity) confirm(`IMPORTANT: If you press OK, this code will be executed in your browser. It could possibly be malicious. Continue?`);
		hasConfirmedSecurity = true;
		if (!source) return alert(`Please enter some source code`);

		isCompiling++;
		try {
			alert(JSON.stringify(await compileTypeScript(source!)));
		} catch (e) {
			alert(`An error occured! Check the console for more info.\n\n${e}: ${(e as any).message}`);
			console.error(`Error updating source`, e);
			throw e;
		} finally {
			isCompiling--;
		}
	}
</script>

<svelte:head>
	<title>Uncharted</title>
</svelte:head>

<h1>Uncharted</h1>

<CodeEditor bind:value={source} />

<Button disabled={isCompiling > 0 || !source} on:click={onUpdate}>
	Update
</Button>

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
