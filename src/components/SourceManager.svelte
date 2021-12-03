<script context="module">
	let instanceCount = 0;
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from '../components/Button.svelte';
	import CodeEditor from '../components/CodeEditor.svelte';
	import { evalTypeScript } from '../utils/ts-compiler';
	// @ts-ignore
	import prettier from 'prettier/standalone';
	import parserTypeScript from 'prettier/parser-typescript';

	export let initialSource: string;
	export let autoFormat: boolean;
	export let disableSecurityConfirmation = false;

	let editor: CodeEditor | undefined;

	let lastError: ["err", unknown] | null = null;

	const instanceId = instanceCount++;
	const dispatch = createEventDispatcher();

	let hasConfirmedSecurity = disableSecurityConfirmation;
	let isCompiling = 0;

	function getSource() {
		return editor?.getValue() ?? initialSource;
	}

	async function onUpdate() {
		if (isCompiling > 0) return;

		dispatch('saveSource', getSource());

		if (
			!hasConfirmedSecurity &&
			!confirm(
				`IMPORTANT: If you press OK, this code will be executed in your browser. It could possibly be malicious. Continue?`
			)
		) {
			return;
		}
		hasConfirmedSecurity = true;

		// Wait a little until reporting back for UX reasons (to let the user know something happened)
		const wait = new Promise(resolve => setTimeout(resolve, 250));

		lastError = null;

		if (autoFormat) onFormat();

		const storedSource = getSource();
		isCompiling++;
		try {
			const result = await evalTypeScript(storedSource);
			await wait;
			dispatch('sourceUpdate', result);
		} catch (e) {
			lastError = ["err", e];
			alert(`An error occured! Check the console for more info.\n\n${e}`);
			console.error(`Error updating source`, e);
			throw e;
		} finally {
			isCompiling--;
		}
	}

	function onFormat() {
		const prettied = prettier
			.formatWithCursor(getSource(), {
				parser: 'typescript',
				plugins: [parserTypeScript],
				cursorOffset: editor?.getCursor() ?? 0,
				printWidth: 100,
				tabWidth: 4,
			});
		const formatted = prettied.formatted.replace(/;\s+$/gm, '\n');

		if (editor) {
			// If the editor is already available, keep cursor info
			editor.setValue(formatted, prettied.cursorOffset);
		} else {
			initialSource = prettied.formatted;
		}
	}
</script>

<CodeEditor initialValue={initialSource} bind:this={editor} on:save={onUpdate} />

{#if lastError}
	<div class="error">
		{`${lastError[1]}`}
	</div>
{/if}

<div class="buttons">
	<div>
		<input
			type="checkbox"
			id={`n2d4-sourcemanager-${instanceId}-checkbox`}
			bind:checked={autoFormat}
			on:change={(e) => dispatch('changeAutoFormat', e.currentTarget.checked)}
		/>
		<label for={`n2d4-sourcemanager-${instanceId}-checkbox`}>Auto-format</label>
	</div>
	<Button on:click={onFormat}>Format</Button>
	<Button primary disabled={isCompiling > 0} on:click={onUpdate}>Save</Button>
</div>

<style>
	.buttons {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: 12px;
	}

	.error {
		color: red;
		font-size: 90%;
		align-self: center;
	}
</style>
