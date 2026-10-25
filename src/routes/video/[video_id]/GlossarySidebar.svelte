<script lang="ts">
	import { resolve } from '$app/paths';
	import { fetchGlossary, GlossaryEntries, pinGlossary, type Glossary } from '$lib/glossary';
	import { tick } from 'svelte';

	const ID_PREFIX = 'glossary-sidebar-';

	const {
		id,
		onclose
	}: {
		/** The id of the sidebar, so that the button that opens it can refer to it. */
		id: string;
		onclose: () => void;
	} = $props();

	let glossary = $state<Glossary | null>(null);
	let failed = $state(false);
	let body = $state<HTMLDivElement>();

	/** The id of the term to highlight. */
	let targetId = $state('');

	$effect(() => {
		fetchGlossary()
			.then((result) => (glossary = result))
			.catch((error) => {
				console.error(error);
				failed = true;
			});
	});

	// while the sidebar is open, glossary terms in the story are shown here instead of in the popup
	$effect(() =>
		pinGlossary((termId) => {
			targetId = termId;
			tick().then(() => focusTerm(termId));
		})
	);

	/** Scrolls the term to the top of the sidebar and moves focus to it, so it is read aloud. */
	function focusTerm(termId: string) {
		const entry = document.getElementById(`${ID_PREFIX}${termId}`);
		if (!body || !entry) return;
		// the body is positioned, so it is the offset parent of the entries
		const gap = parseFloat(getComputedStyle(entry).scrollMarginTop) || 0;
		body.scrollTo({ top: entry.offsetTop - gap, behavior: 'smooth' });
		entry.focus({ preventScroll: true });
	}
</script>

<aside {id} class="glossary-sidebar" aria-labelledby="{id}-title">
	<div class="header">
		<h2 id="{id}-title">Glossary</h2>
		<a class="page-link" href={resolve('/glossary')} target="_blank" rel="noopener">Open page</a>
		<button type="button" class="close" aria-label="Close glossary" title="Close" onclick={onclose}>
			<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
				<path
					d="m4.397 4.554.073-.084a.75.75 0 0 1 .976-.073l.084.073L12 10.939l6.47-6.47a.75.75 0 1 1 1.06 1.061L13.061 12l6.47 6.47a.75.75 0 0 1 .072.976l-.073.084a.75.75 0 0 1-.976.073l-.084-.073L12 13.061l-6.47 6.47a.75.75 0 0 1-1.06-1.061L10.939 12l-6.47-6.47a.75.75 0 0 1-.072-.976l.073-.084-.073.084Z"
					fill="currentColor"
				/>
			</svg>
		</button>
	</div>

	<div class="body" bind:this={body}>
		{#if glossary}
			<p class="hint">Select an underlined term in the description to show it here.</p>
			<GlossaryEntries
				entries={glossary.entries}
				{targetId}
				idPrefix={ID_PREFIX}
				headingLevel="h3"
				linksInNewTab
			/>
		{:else if failed}
			<p class="hint">The glossary could not be loaded.</p>
		{:else}
			<p class="hint">Loading the glossary…</p>
		{/if}
	</div>
</aside>

<style>
	.glossary-sidebar {
		--header-size: 3.25rem;
		--sidebar-height: calc(100dvh - var(--header-height));

		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		height: var(--sidebar-height);
		background-color: var(--color-surface);
		color: var(--color-text);
		animation: slide-in 167ms cubic-bezier(0, 0, 0, 1);
	}

	/* pinned beside the page on wide screens */
	@media (min-width: 1000px) {
		.glossary-sidebar {
			flex: 0 0 24rem;
			border-left: 1px solid var(--color-border);
		}
	}

	/* without room for a third column, it covers the related episodes beside the video */
	@media (min-width: 1000px) and (max-width: 1399px) {
		.glossary-sidebar {
			position: fixed;
			top: var(--header-height);
			right: 0;
			z-index: 50;
			width: 24rem;
			box-shadow: -8px 0 32px rgba(0 0 0 / 25%);
		}
	}

	/* a sheet along the bottom of small screens, so the video stays in view */
	@media (max-width: 999px) {
		.glossary-sidebar {
			--sidebar-height: 55dvh;
			--slide-from: translateY(1.5rem);
			position: fixed;
			inset: auto 0 0;
			z-index: 50;
			border-top: 1px solid var(--color-border);
			box-shadow: 0 -8px 32px rgba(0 0 0 / 25%);
		}
	}

	@keyframes slide-in {
		from {
			opacity: 0;
			transform: var(--slide-from, translateX(1.5rem));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.glossary-sidebar {
			animation: none;
		}
	}

	.header {
		flex: 0 0 var(--header-size);
		box-sizing: border-box;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0 0.5rem 0 1.5rem;
		border-bottom: 1px solid var(--color-border);
	}

	h2 {
		flex: 1;
		margin: 0;
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--color-accent);
	}

	.page-link {
		padding: 0.4rem 0.5rem;
		border-radius: var(--radius-button);
		color: var(--color-accent);
		font-weight: 600;
		font-size: 0.875rem;
		text-decoration: none;
		transition: background-color 80ms ease-in-out;
	}

	.close {
		display: grid;
		place-items: center;
		width: 2.25rem;
		height: 2.25rem;
		padding: 0.525rem;
		border: none;
		border-radius: var(--radius-button);
		background-color: transparent;
		color: var(--color-accent);
		transition: background-color 80ms ease-in-out;
	}

	.page-link:hover,
	.close:hover {
		background-color: var(--color-accent-bg);
	}

	.page-link:active,
	.close:active {
		background-color: var(--color-accent-bg-active);
	}

	.page-link:focus-visible,
	.close:focus-visible {
		outline: 3px solid var(--color-accent);
		outline-offset: -3px;
	}

	.body {
		--scrollport-height: calc(var(--sidebar-height) - var(--header-size));
		/* the space between the header and a term that is scrolled to */
		--sticky-height: 0.5rem;

		position: relative;
		flex: 1;
		min-height: 0;
		padding-inline: 1.5rem;
		overflow-y: auto;
		/* do not scroll the page when reaching the end of the glossary */
		overscroll-behavior: contain;
	}

	.hint {
		margin: 1.25rem 0 0;
		font-size: 0.9rem;
		color: var(--color-muted);
	}
</style>
