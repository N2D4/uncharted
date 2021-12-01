<script lang="ts">
    import type monaco from 'monaco-editor';
	import { onMount } from 'svelte';
	import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
	import LoadingSpinner from './LoadingSpinner.svelte';

	export let value: string | null;

	let divEl!: HTMLDivElement;
	let monacoEditor: monaco.editor.IStandaloneCodeEditor | null = null;
	let storage: Storage | null = null;

	onMount(async () => {
		storage = window.localStorage;

        console.log(value);
		// Await monaco-editor to be loaded
		const monaco = await import('monaco-editor');
		divEl.innerHTML = '';

		// Create the editor
		(globalThis as any).MonacoEnvironment = {
			getWorker: () => new tsWorker()
		};
		const editor = monaco.editor.create(divEl, {
			value: value ?? '',
			language: 'javascript'
		});
		editor.onDidChangeModelContent(() => (value = editor!.getValue()));
		monacoEditor = editor;
        new ResizeObserver(() => editor.layout()).observe(divEl)

		return () => {
			editor.dispose();
		};
	});

	$: value === null &&
		storage &&
		(value =
			storage.getItem('@n2d4/uncharted:recent-code') ??
			`(x: number, y: number) => {\n\tlet xSquared = x ** 2;\n\treturn xSquared - y;\n}\n`);
	$: value !== null && monacoEditor && value !== monacoEditor.getValue() && monacoEditor.setValue(value);
</script>

<div bind:this={divEl} class="editor">
	<LoadingSpinner />
</div>

<style>
	.editor {
		align-self: stretch;
		flex: 1 1 400px;
        resize: vertical;
        box-sizing: border-box;
		overflow: hidden;
        background-color: white;
        border: 1px solid currentColor;
        border-radius: 10px;

        /* Border only renders above editor with a sufficiently large z-index */
        position: relative;
        z-index: 99999;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
	}
</style>
