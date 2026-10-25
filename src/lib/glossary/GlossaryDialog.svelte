<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { tick } from 'svelte';
	import { glossaryDialog } from './dialog.svelte';
	import GlossaryEntries from './GlossaryEntries.svelte';

	const ID_PREFIX = 'glossary-dialog-';

	let dialog: HTMLDialogElement;
	let body = $state<HTMLDivElement>();

	// open and close the dialog to match the state, and scroll to the term whenever it changes
	$effect(() => {
		const { open, termId } = glossaryDialog;
		if (!open) {
			if (dialog.open) dialog.close();
			return;
		}
		if (!dialog.open) dialog.showModal();
		tick().then(() => focusTerm(termId));
	});

	/** Scrolls the term to the top of the dialog and moves focus to it, so it is read aloud. */
	function focusTerm(termId: string) {
		const entry = document.getElementById(`${ID_PREFIX}${termId}`);
		if (!body || !entry) return;
		// layout offsets are used instead of `getBoundingClientRect()`, which includes the
		// scale of the opening animation (the body is positioned, so it is the offset parent)
		const gap = parseFloat(getComputedStyle(entry).scrollMarginTop) || 0;
		body.scrollTop = entry.offsetTop - gap;
		entry.focus({ preventScroll: true });
	}

	function close() {
		glossaryDialog.open = false;
	}

	// the dialog would otherwise stay open over the next page
	beforeNavigate(close);
</script>

<dialog
	bind:this={dialog}
	class="glossary-dialog"
	aria-labelledby="glossary-dialog-title"
	onclose={close}
	onclick={(event) => {
		// close when the backdrop (which is part of the dialog element) is clicked
		if (event.target === dialog) close();
	}}
>
	<div class="header">
		<h2 id="glossary-dialog-title">Glossary</h2>
		<a
			class="page-link"
			href={resolve(`/glossary/#${glossaryDialog.termId}`)}
			target="_blank"
			rel="noopener">Open glossary page</a
		>
		<button type="button" class="close" aria-label="Close" onclick={close}>
			<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
				<path
					d="m4.397 4.554.073-.084a.75.75 0 0 1 .976-.073l.084.073L12 10.939l6.47-6.47a.75.75 0 1 1 1.06 1.061L13.061 12l6.47 6.47a.75.75 0 0 1 .072.976l-.073.084a.75.75 0 0 1-.976.073l-.084-.073L12 13.061l-6.47 6.47a.75.75 0 0 1-1.06-1.061L10.939 12l-6.47-6.47a.75.75 0 0 1-.072-.976l.073-.084-.073.084Z"
					fill="currentColor"
				/>
			</svg>
		</button>
	</div>

	<div class="body" bind:this={body}>
		{#if glossaryDialog.open && glossaryDialog.glossary}
			<GlossaryEntries
				entries={glossaryDialog.glossary.entries}
				targetId={glossaryDialog.termId}
				idPrefix={ID_PREFIX}
				headingLevel="h3"
				linksInNewTab
			/>
		{/if}
	</div>
</dialog>

<style>
	.glossary-dialog {
		--accent: light-dark(#4868a9, #c5dbff);
		--accent-bg: light-dark(#ecf3ff, #303030);
		--border: light-dark(#ccc, #333);
		--dialog-height: min(100dvh - 2rem, 40rem);
		--header-size: 3.25rem;

		box-sizing: border-box;
		width: min(100% - 2rem, 46rem);
		height: var(--dialog-height);
		max-height: none;
		margin: auto;
		padding: 0;
		overflow: hidden;
		border: 1px solid var(--border);
		border-radius: 0.25rem;
		background-color: light-dark(white, #212121);
		color: light-dark(#1a1a1a, #f0f0f0);
		color-scheme: light dark;
		font-family: inherit;
		box-shadow:
			0 32px 64px rgba(0 0 0 / 25%),
			0 2px 21px rgba(0 0 0 / 20%);

		/* animate out by keeping the dialog displayed until the animation ends */
		animation: dialog-out 167ms cubic-bezier(0, 0, 0, 1);
		transition:
			display 167ms allow-discrete,
			overlay 87ms allow-discrete;
	}

	.glossary-dialog:open {
		display: flex;
		flex-direction: column;
		animation-name: dialog-in;
	}

	.glossary-dialog::backdrop {
		background-color: rgba(0 0 0 / 30%);
		animation: fade-out 87ms linear;
	}

	.glossary-dialog:open::backdrop {
		animation-name: fade-in;
	}

	@media (prefers-reduced-motion: reduce) {
		.glossary-dialog,
		.glossary-dialog::backdrop {
			animation: none;
		}
	}

	.header {
		flex: 0 0 var(--header-size);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0 0.5rem 0 1.5rem;
		border-bottom: 1px solid var(--border);
	}

	h2 {
		flex: 1;
		margin: 0;
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--accent);
	}

	.page-link {
		padding: 0.4rem 0.5rem;
		border-radius: 0.25rem;
		color: var(--accent);
		font-weight: 600;
		text-decoration: none;
		transition: background-color 80ms ease-in-out;
	}

	.page-link:hover,
	.close:hover {
		background-color: var(--accent-bg);
	}

	.page-link:active,
	.close:active {
		background-color: light-dark(#d6e2ff, #3a3a3a);
	}

	.close {
		display: grid;
		place-items: center;
		width: 2.25rem;
		height: 2.25rem;
		padding: 0.4rem;
		border: none;
		border-radius: 0.25rem;
		background-color: transparent;
		color: var(--accent);
		transition: background-color 80ms ease-in-out;
	}

	.page-link:focus-visible,
	.close:focus-visible {
		outline: 3px solid var(--accent);
		outline-offset: -3px;
	}

	.body {
		--scrollport-height: calc(var(--dialog-height) - var(--header-size) - 2px);
		/* the space between the header and a term that is scrolled to */
		--sticky-height: 0.5rem;

		position: relative;

		flex: 1;
		min-height: 0;
		padding-inline: 1.5rem;
		overflow-y: auto;
		/* do not scroll the page behind the dialog when reaching the end of the glossary */
		overscroll-behavior: contain;
	}

	@keyframes dialog-in {
		from {
			opacity: 0;
			transform: scale(1.05);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes dialog-out {
		from {
			opacity: 1;
			transform: scale(1);
		}
		to {
			opacity: 0;
			transform: scale(1.05);
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes fade-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
</style>
