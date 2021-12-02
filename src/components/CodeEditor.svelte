<script lang="ts">
	import type monaco from 'monaco-editor';
	import { createEventDispatcher, onMount } from 'svelte';
	import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
	import LoadingSpinner from './LoadingSpinner.svelte';

	let initialValue = "";
	let initialCursor = 0;
	const dispatch = createEventDispatcher();

	let divEl!: HTMLDivElement;
	let monacoEditor: monaco.editor.IStandaloneCodeEditor | null = null;

	onMount(async () => {
		// Await monaco-editor to be loaded
		const monaco = await import('monaco-editor');
		divEl.innerHTML = '';

		// Create the editor
		(globalThis as any).MonacoEnvironment = {
			getWorker: () => new tsWorker()
		};
		const editor = monaco.editor.create(divEl, {
			value: initialValue,
			language: 'typescript',
		});
		editor.setPosition(editor.getModel()!.getPositionAt(initialCursor));
		editor.onDidChangeModelContent(() => dispatch('change'));
		editor.onDidChangeCursorPosition(e => dispatch('changeCursor'));
		monacoEditor = editor;
		new ResizeObserver(() => editor.layout()).observe(divEl);

		// Destructor
		return () => {
			editor.dispose();
		};
	});

	export function setValue(newValue: string, newCursor: number = 0) {
		if (monacoEditor) {
			monacoEditor.setValue(newValue);
			monacoEditor.setPosition(monacoEditor.getModel()!.getPositionAt(newCursor));
		} else {
			initialValue = newValue;
			initialCursor = newCursor;
		}
	}

	export function getValue(): string | undefined {
		return monacoEditor?.getValue();
	}

	export function getCursor(): number | undefined {
		const position = monacoEditor?.getPosition();
		return (position && monacoEditor?.getModel()?.getOffsetAt(position)) ?? undefined;
	}

	function onKeyDown(event: KeyboardEvent) {
		if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
			dispatch('save');
			event.preventDefault();
		}
	}
</script>

<div
	bind:this={divEl}
	on:keydown={onKeyDown}
	class="editor"
>
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
