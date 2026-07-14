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
			rootNode: `.${randomClass}`
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
</style>
