<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import ProgressRing from '$components/ProgressRing/ProgressRing.svelte';
	import { fetchGlossary, linkGlossaryTerms } from '$lib/glossary';
	import type { StoryLoad } from './storyLoader';

	const {
		story,
		onStoryLoaded,
		loadingHeight,
		class: className
	} = $props<{
		/**
		 * The story to show from `loadStory()`. It is `null` when the page is prerendered.
		 */
		story: StoryLoad | null;

		/**
		 * Fires when the story has finished loading.
		 *
		 * If the story already loaded before the page was shown (such as when
		 * navigating from another page), it fires as soon as the story is in the page.
		 */
		onStoryLoaded?: (node: HTMLElement) => void;

		/**
		 * Defaults to `100dvh` (100% of the viewport height). This is the height of the
		 * story embed while it is loading. The story embed will expand or contract to fit the
		 * story once it has loaded.
		 */
		loadingHeight?: string;

		/**
		 * Optional class to apply to the root element of the component.
		 *
		 * It is rendered into the prerendered HTML, so it can be used for styles
		 * (such as the color scheme) that must apply before the story loads.
		 */
		class?: string;
	}>();

	let loaded = $state(false);

	// convert https://link.local links to links that are for the current host
	function convertLocalLinks(node: HTMLElement) {
		const links = node.querySelectorAll<HTMLAnchorElement>('a[href^="https://link.local"]');
		for (const link of links) {
			const url = new URL(link.href);
			url.host = location.host;
			link.href = resolve(url.toString().slice(url.origin.length)); // make it relative to the current host
			link.target = '_self'; // open in the same tab, not a new one

			// navigate with the SvelteKit router instead of reloading the page
			// (the story's own click handlers would otherwise run first and may bypass it)
			link.addEventListener('click', (event) => {
				const isModified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
				if (event.button !== 0 || isModified) return; // let the browser open new tabs/windows
				event.preventDefault();
				event.stopPropagation();
				goto(link.href);
			});
		}
	}

	// move the story from the off-screen container into this page
	function adopt(slot: HTMLDivElement) {
		if (!story) return;
		const host = story.host;
		host.style.setProperty('--loading-height', loadingHeight ?? '100dvh');
		slot.appendChild(host);
		// the page is shown, so its URL matches and the story may load (if it has not already)
		story.adopted = true;
		story.start();

		let cancelled = false;
		let stopLinkingGlossaryTerms: (() => void) | undefined;
		const markLoaded = (article: HTMLElement | null) => {
			if (cancelled || !article) return;
			loaded = true;
			convertLocalLinks(article);
			onStoryLoaded?.(article);

			// link glossary terms in the story, including any content injected by `onStoryLoaded`
			fetchGlossary()
				.then((glossary) => {
					if (cancelled) return;
					stopLinkingGlossaryTerms = linkGlossaryTerms(article, glossary);
				})
				.catch((error) => console.error('Glossary terms could not be linked:', error));
		};
		if (story.article) markLoaded(story.article);
		else story.ready.then(markLoaded);

		return () => {
			cancelled = true;
			stopLinkingGlossaryTerms?.();
			story.dispose();
		};
	}

	$effect(() => {
		story?.host.classList.toggle('loaded', loaded);
	});
</script>

<!-- reserve the loading height up front, since the story is only added to the page after it mounts -->
<div
	class="storymap-embed-wrapper {className ?? ''}"
	style:min-height={loaded ? undefined : (loadingHeight ?? '100dvh')}
>
	<div class="storymap-slot" {@attach adopt}></div>
	{#if !loaded}
		<div class="loading-message">
			<ProgressRing></ProgressRing>
			<span>Please wait while the story loads.</span>
			<span>This may take a few seconds.</span>
		</div>
	{/if}
</div>

<style>
	.storymap-embed-wrapper {
		position: relative;
	}

	.loading-message {
		position: absolute;
		inset: 0;
		background-color: light-dark(#f5f9ff, #212121);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.loading-message > span:first-of-type {
		margin-top: 1rem;
	}
	.loading-message > span {
		font-weight: 500;
		margin-top: 0.25rem;
	}

	:global(.storymap-embed:not(.loaded)) {
		height: var(--loading-height, 100dvh);
	}

	:global(.storymap-embed) :global(> *) {
		opacity: 0;
		transform: translateY(40px);
		transition:
			opacity 210ms cubic-bezier(0.16, 1, 0.3, 1),
			transform 210ms cubic-bezier(0.16, 1, 0.3, 1);
	}
	:global(.storymap-embed.loaded) :global(> *) {
		transform: translateY(0);
		opacity: 1;
	}

	/* Esri has a bug where they do not set the display mode for
	the category buttons inside categorical map tours. It also
	causes missing styles for the category dropdown. */
	:global(.storymap-embed) :global(.immersive.categorized > .places-section .sm-button),
	:global(.storymap-embed)
		:global(
			.immersive.categorized
				[data-testid='categorized-tour-nav-header']
				:where(.sm-button, .sm-button > .icon-wrapper)
		) {
		user-select: none;
		letter-spacing: calc(var(--storymaps-spacing-scale, 1) * 0.02rem);
		grid-auto-flow: column;
		display: inline-grid;
		gap: var(--sm-web-theme-spacing-xxxs);
		align-items: center;
	}
	:global(.storymap-embed)
		:global(
			.immersive.categorized [data-testid='categorized-tour-nav-header'] .sm-button > .icon-wrapper
		) {
		width: auto;
		--sm-web-theme-spacing-xxxs: calc(var(--storymaps-spacing-scale, 1) * 0.8rem);
		--sm-web-theme-spacing-md: calc(var(--storymaps-spacing-scale, 1) * 4rem);
		height: var(--sm-web-theme-spacing-md);
		padding: var(--sm-web-theme-spacing-xxxs);
	}
	:global(
		div[data-floating-ui-portal]
			ul[aria-labelledby='category-combobox-label-id']
			li.combobox-option-color
	) {
		--sm-web-theme-spacing-xxs: calc(var(--storymaps-spacing-scale, 1) * 1.6rem);
		--sm-web-theme-spacing-xxxs: calc(var(--storymaps-spacing-scale, 1) * 0.8rem);
		--sm-web-theme-border-radius-regular: 2px;
	}

	/* the header of a categorized map tour (shown after choosing a category) should stick below the titlebar */
	:global(.storymap-embed) :global(.immersive.categorized nav.header) {
		position: sticky !important;
		top: var(--header-height) !important;
		z-index: 2;
		/*
		 * It was originally absolutely positioned, so it did not take a grid area.
		 * Sticky elements do, so share the first row with the sections (which already
		 * reserve space for the header with padding) instead of pushing them to a new row.
		 */
		grid-row: 1 !important;
		align-self: start;
	}
	:global(.storymap-embed) :global(.immersive.categorized .places-section) {
		grid-row: 1 !important;
	}

	/* glossary terms are subtle so that prose with many terms is still easy to read */
	:global(.storymap-embed a.glossary-term) {
		color: inherit;
		font: inherit;
		text-decoration-line: underline;
		text-decoration-style: dotted;
		text-decoration-thickness: 1.5px;
		text-decoration-color: light-dark(#4868a9, #c5dbff);
		text-underline-offset: 0.2em;
		cursor: help;
	}
	:global(.storymap-embed a.glossary-term:hover) {
		text-decoration-style: solid;
		color: light-dark(#4868a9, #c5dbff);
	}

	:global(#storymaps-root) {
		--sm-story-theme-spacing-xxs: calc(
			var(--sm-story-theme-spacing-xxs-raw) * var(--storymaps-spacing-scale, 1)
		);
		--sm-story-theme-spacing-xxs-raw: 1.6rem;
	}
</style>
