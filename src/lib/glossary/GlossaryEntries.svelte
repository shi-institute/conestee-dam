<script lang="ts">
	import { resolve } from '$app/paths';
	import { groupByLetter, type GlossaryEntry } from './types';

	const {
		entries,
		targetId = '',
		idPrefix = '',
		headingLevel = 'h2',
		linksInNewTab = false
	}: {
		/** The entries to show, sorted alphabetically. */
		entries: GlossaryEntry[];
		/** The id of the term to highlight. */
		targetId?: string;
		/**
		 * Prepended to every element id so that the entries can be shown more than
		 * once in a document (such as in the glossary popup) without duplicate ids.
		 */
		idPrefix?: string;
		headingLevel?: `h${2 | 3 | 4 | 5 | 6}`;
		/** Whether links to terms open in a new tab, such as when the entries are in a popup. */
		linksInNewTab?: boolean;
	} = $props();

	const groups = $derived(groupByLetter(entries));
</script>

<!--
	The parent may set these custom properties:
	--sticky-height: the height of anything stuck to the top of the scroll container
	--scrollport-height: the height of the scroll container (defaults to the viewport)
	--scroll-end-space: the height of anything after the entries in the scroll container
-->
<div class="glossary-entries">
	{#each groups as group (group.letter)}
		{@const letterId = `${idPrefix}letter-${group.letter.toLowerCase()}`}
		<!-- the anchor is on the section because the letter heading is sticky on wide screens -->
		<section id={letterId} aria-labelledby="{letterId}-heading">
			<svelte:element this={headingLevel} id="{letterId}-heading" class="letter">
				{group.letter}
			</svelte:element>
			<dl style:--entry-count={group.entries.length}>
				{#each group.entries as entry (entry.id)}
					<div
						class="entry"
						class:targeted={entry.id === targetId}
						id="{idPrefix}{entry.id}"
						tabindex="-1"
					>
						<dt>
							<!-- eslint-disable-next-line svelte/no-at-html-tags -- rendered from glossary.md in this repository -->
							{@html entry.termHtml}
							<a
								class="anchor"
								href={resolve(`glossary/#${entry.id}`)}
								target={linksInNewTab ? '_blank' : undefined}
								rel={linksInNewTab ? 'noopener' : undefined}
								aria-label="Link to this term">#</a
							>
						</dt>
						<dd>
							<!-- eslint-disable-next-line svelte/no-at-html-tags -- rendered from glossary.md in this repository -->
							{@html entry.definitionHtml}
						</dd>
					</div>
				{/each}
			</dl>
		</section>
	{/each}
</div>

<style>
	.glossary-entries {
		container-type: inline-size;
		color: var(--color-text);
		line-height: 1.55;
	}

	section {
		display: grid;
		grid-template-columns: 1fr;
		padding-block: 2rem;
		border-bottom: 1px solid var(--color-border);
		scroll-margin-top: var(--sticky-height, 0px);
	}

	section:last-child {
		border-bottom: none;
	}

	/*
	 * Leave enough room below the last term that any letter or term can scroll to the top.
	 */
	section:last-child dl {
		display: grid;
		align-items: start;
	}

	/* both are placed explicitly; otherwise, the last term is auto-placed in the next row */
	section:last-child .entry:last-child,
	section:last-child dl::after {
		grid-row: var(--entry-count);
		grid-column: 1;
	}

	section:last-child dl::after {
		content: '';
		width: 1px;
		height: calc(
			var(--scrollport-height, 100dvh) - var(--sticky-height, 0px) - var(--scroll-end-space, 0px) -
				0.5rem
		);
		pointer-events: none;
	}

	@container (min-width: 640px) {
		section {
			grid-template-columns: 4rem 1fr;
			gap: 1.5rem;
		}
	}

	.letter {
		margin: 0 0 0.5rem;
		font-size: 2.5rem;
		font-weight: 800;
		line-height: 1;
		color: var(--color-accent);
	}

	@container (min-width: 640px) {
		.letter {
			position: sticky;
			top: calc(var(--sticky-height, 0px) + 1.5rem);
			align-self: start;
			margin: 0;
		}
	}

	dl {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin: 0;
	}

	.entry {
		margin-inline: -1rem;
		padding: 0.875rem 1rem;
		border-radius: var(--radius-surface);
		scroll-margin-top: calc(var(--sticky-height, 0px) + 0.5rem);
		transition: background-color 400ms ease-in-out;
	}

	/* the entry is only focused by script, to move focus to a linked term */
	.entry:focus {
		outline: none;
	}

	/* highlight a term when a link takes the reader to it */
	.entry:target,
	.entry.targeted {
		background-color: var(--color-accent-bg);
		box-shadow: inset 3px 0 0 var(--color-accent);
	}

	dt {
		font-size: 1.2rem;
		font-weight: 700;
		line-height: 1.3;
	}

	.anchor {
		margin-left: 0.25rem;
		padding: 0 0.25rem;
		border-radius: var(--radius-button);
		color: var(--color-muted);
		font-weight: 500;
		text-decoration: none;
		opacity: 0;
		transition:
			opacity 80ms ease-in-out,
			background-color 80ms ease-in-out;
	}

	.entry:hover .anchor,
	.anchor:focus-visible {
		opacity: 1;
	}

	.anchor:hover {
		background-color: var(--color-accent-bg);
		color: var(--color-accent);
	}

	@media (hover: none) {
		.anchor {
			display: none;
		}
	}

	dd {
		margin: 0.35rem 0 0;
	}

	dd :global(p) {
		margin: 0 0 0.75rem;
	}

	dd :global(> :last-child) {
		margin-bottom: 0;
	}

	dd :global(a) {
		color: var(--color-accent);
		text-underline-offset: 0.15em;
	}

	dd :global(a:hover) {
		text-decoration-thickness: 2px;
	}

	a:focus-visible,
	dd :global(a:focus-visible) {
		outline: 3px solid var(--color-accent);
		outline-offset: 2px;
	}
</style>
