<script lang="ts">
	import ProgressRing from '$components/ProgressRing/ProgressRing.svelte';

	const { storyId, onStoryLoaded, loadingHeight } = $props<{
		/**
		 * The ArcGIS StoryMaps story ID to embed.
		 */
		storyId: string;

		/**
		 * Fires when the story has finished loading.
		 *
		 * Since StoryMaps does not provide a callback for when the story has loaded,
		 * we watch for the presence of `.title-container` with `.sc-title` to estimate
		 * that the story has loaded.
		 */
		onStoryLoaded?: (node: HTMLElement) => void;

		/**
		 * Defaults to `100dvh` (100% of the viewport height). This is the height of the
		 * story embed while it is loading. The story embed will expand or contract to fit the
		 * story once it has loaded.
		 */
		loadingHeight?: string;
	}>();

	function embed(host: HTMLDivElement) {
		const randomClass = `storymaps-root-${Math.random().toString(36).slice(2)}`;
		host.classList.add(randomClass);

		window.storyMapsEmbedConfig = {
			storyId,
			rootNode: `.${randomClass}`,
			// StoryMaps sizes, sticks, and scrolls immersive blocks below this offset
			topOffset:
				(getComputedStyle(document.body)
					.getPropertyValue('--header-height')
					.trim() as `${string}px`) || ('3rem' as `${string}rem`),
			font: {
				body: {
					fontFamily: 'greycliff-cf',
					weight: {
						normal: 400,
						bold: 700
					}
				},
				title: {
					fontFamily: 'greycliff-cf',
					weight: {
						normal: 600,
						bold: 600
					}
				}
			}
		};

		const script = document.createElement('script');
		script.src = 'https://storymaps.arcgis.com/embed/view';
		script.type = 'text/javascript';
		script.async = true;
		host.ownerDocument.head.appendChild(script);

		// wait for the story to load so that we can call the onStoryLoaded callback.
		const storyLoadWatcher = waitForStoryToLoad(host);

		return {
			destroy() {
				delete window.storyMapsEmbedConfig;
				host.ownerDocument.head.removeChild(script);
				storyLoadWatcher.destroy();
			}
		};
	}

	let loaded = $state(false);

	/**
	 * The presence of `.title-container` with `.sc-title` indicates that the story has loaded.
	 *
	 * We watch for this element to appear so that we can then act on the story being loaded.
	 */
	function waitForStoryToLoad(host: HTMLDivElement) {
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				for (const node of mutation.addedNodes) {
					if (
						node instanceof HTMLElement &&
						node.tagName === 'ARTICLE' &&
						node.classList.contains('story') &&
						node.querySelector('.sc-title')
					) {
						observer.disconnect();
						loaded = true;
						onStoryLoaded?.(node as HTMLElement);
						return;
					}
				}
			}
		});

		observer.observe(host, { childList: true, subtree: true });

		return {
			destroy() {
				observer.disconnect();
			}
		};
	}
</script>

<div class="storymap-embed-wrapper">
	<div
		use:embed
		class="storymap-embed"
		class:loaded
		style="--loading-height: {loadingHeight}"
	></div>
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
		background-color: #f5f9ff;
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

	.storymap-embed:not(.loaded) {
		height: var(--loading-height, 100dvh);
	}

	.storymap-embed :global(> *) {
		opacity: 0;
		transform: translateY(40px);
		transition:
			opacity 210ms cubic-bezier(0.16, 1, 0.3, 1),
			transform 210ms cubic-bezier(0.16, 1, 0.3, 1);
	}
	.storymap-embed.loaded :global(> *) {
		transform: translateY(0);
		opacity: 1;
	}

	/* Esri has a bug where they do not set the display mode for
	the category buttons inside categorical map tours. It also
	causes missing styles for the category dropdown. */
	.storymap-embed :global(.immersive.categorized > .places-section .sm-button),
	.storymap-embed
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
	.storymap-embed
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
	.storymap-embed :global(.immersive.categorized nav.header) {
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
	.storymap-embed :global(.immersive.categorized .places-section) {
		grid-row: 1 !important;
	}
</style>
