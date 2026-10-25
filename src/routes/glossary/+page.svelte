<script lang="ts">
	import { page } from '$app/state';
	import { GlossaryEntries, groupByLetter } from '$lib/glossary';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

	let query = $state('');

	const filteredEntries = $derived.by(() => {
		const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
		if (words.length === 0) return data.entries;
		return data.entries.filter((entry) => words.every((word) => entry.searchText.includes(word)));
	});

	const availableLetters = $derived(
		new Set(groupByLetter(filteredEntries).map((group) => group.letter))
	);

	// `:target` is not updated when SvelteKit navigates here from another page with
	// `pushState`, so the linked term must also be tracked from the URL
	const targetId = $derived(decodeURIComponent(page.url.hash.slice(1)));
</script>

<svelte:head>
	<title>Glossary - Lake Conestee Dam</title>
</svelte:head>

<main class="glossary">
	<div class="intro">
		<h1>Glossary</h1>
		<div class="lead">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- rendered from glossary.md in this repository -->
			{@html data.introHtml}
		</div>

		<label class="search">
			<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
				<path
					d="M10 2.75a7.25 7.25 0 0 1 5.63 11.819l4.9 4.9a.75.75 0 0 1-.976 1.134l-.084-.073-4.901-4.9A7.25 7.25 0 1 1 10 2.75Zm0 1.5a5.75 5.75 0 1 0 0 11.5 5.75 5.75 0 0 0 0-11.5Z"
					fill="currentColor"
				/>
			</svg>
			<span class="visually-hidden">Search the glossary</span>
			<input type="search" placeholder="Search terms and definitions" bind:value={query} />
		</label>
	</div>

	<nav class="letters" aria-label="Jump to letter">
		<ul>
			{#each LETTERS as letter (letter)}
				<li>
					{#if availableLetters.has(letter)}
						<a href="#letter-{letter.toLowerCase()}">{letter}</a>
					{:else}
						<span aria-disabled="true">{letter}</span>
					{/if}
				</li>
			{/each}
		</ul>
	</nav>

	<div class="entries" aria-live="polite">
		{#if filteredEntries.length > 0}
			<GlossaryEntries entries={filteredEntries} {targetId} />
		{:else}
			<p class="empty">
				No terms match “{query.trim()}”.
				<button type="button" onclick={() => (query = '')}>Clear search</button>
			</p>
		{/if}
	</div>
</main>

<style>
	:global(:root:has(.glossary)) {
		color-scheme: light dark;
	}

	.glossary {
		--content-width: 52rem;
		--letters-height: 2.75rem;
		/* the space covered by the sticky site header and letter navigation */
		--sticky-height: calc(var(--header-height) + var(--letters-height));

		color: var(--color-text);
		line-height: 1.55;
		/* leave room for the under construction banner */
		padding-bottom: 6rem;
	}

	.intro,
	.entries {
		box-sizing: border-box;
		max-width: calc(var(--content-width) + 3rem);
		margin-inline: auto;
		padding-inline: 1.5rem;
	}

	/* introduction */
	.intro {
		padding-block: 3.5rem 1.5rem;
	}

	h1 {
		font-size: clamp(2.25rem, 6vw, 3.25rem);
		font-weight: 800;
		line-height: 1.05;
		margin: 0 0 0.75rem;
	}

	.lead {
		max-width: 40rem;
		font-size: 1.15rem;
		color: var(--color-muted);
	}

	.lead :global(p) {
		margin: 0;
	}

	.search {
		position: relative;
		display: block;
		margin-top: 1.75rem;
		max-width: 28rem;
	}

	.search svg {
		position: absolute;
		top: 50%;
		left: 0.75rem;
		width: 1.25rem;
		height: 1.25rem;
		transform: translateY(-50%);
		color: var(--color-muted);
		pointer-events: none;
	}

	.search input {
		box-sizing: border-box;
		width: 100%;
		padding: 0.65rem 0.75rem 0.65rem 2.5rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-button);
		background-color: light-dark(white, #2a2a2a);
		color: inherit;
		font: inherit;
		transition: border-color 80ms ease-in-out;
	}

	.search input:hover {
		border-color: var(--color-muted);
	}

	.search input:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: -1px;
		border-color: var(--color-accent);
	}

	/* letter navigation, which sticks below the site header */
	.letters {
		position: sticky;
		top: var(--header-height);
		z-index: 10;
		background-color: var(--color-surface);
		box-shadow: 0 1px 0 var(--color-border);
	}

	.letters ul {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		height: var(--letters-height);
		max-width: calc(var(--content-width) + 3rem);
		margin: 0 auto;
		padding: 0 1rem;
		list-style: none;
		overflow-x: auto;
		scrollbar-width: none;
	}

	.letters li {
		flex: 1 0 auto;
		text-align: center;
	}

	.letters a,
	.letters span {
		display: inline-block;
		min-width: 1.75rem;
		padding: 0.25rem 0.125rem;
		border-radius: var(--radius-button);
		font-weight: 600;
		line-height: 1.25;
	}

	.letters a {
		color: var(--color-accent);
		text-decoration: none;
		transition: background-color 80ms ease-in-out;
	}

	.letters a:hover {
		background-color: var(--color-accent-bg);
	}

	.letters a:active {
		background-color: var(--color-accent-bg-active);
	}

	.letters span {
		color: light-dark(#c4c4c4, #4a4a4a);
	}

	/* entries */
	.entries {
		--scrollport-height: 100dvh;
	}

	a:focus-visible,
	button:focus-visible {
		outline: 3px solid var(--color-accent);
		outline-offset: 2px;
	}

	.empty {
		padding-block: 3rem;
		color: var(--color-muted);
		text-align: center;
	}

	.empty button {
		margin-left: 0.25rem;
		padding: 0;
		border: none;
		background: none;
		color: var(--color-accent);
		font: inherit;
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 0.15em;
		cursor: pointer;
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
</style>
