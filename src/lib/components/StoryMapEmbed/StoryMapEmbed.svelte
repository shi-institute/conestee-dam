<script lang="ts">
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import ProgressRing from '$components/ProgressRing/ProgressRing.svelte';
	import StoryHeading from '$components/StoryHeading/StoryHeading.svelte';
	import { fetchGlossary, linkGlossaryTerms } from '$lib/glossary';
	import { mount, tick, unmount, type Component } from 'svelte';
	import { expoOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import {
		hasScrollPosition,
		restoreScrollPosition,
		saveScrollPosition,
		scrollToElement
	} from './scrollMemory';
	import type { StoryLoad } from './storyLoader';
	import StoryNavigation from './StoryNavigation.svelte';

	const {
		story,
		onStoryLoaded,
		loadingHeight,
		loadingName = 'story',
		navigation = false,
		heading = true,
		components = {},
		class: className
	}: {
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
		 * What the story is called in the loading message ("Please wait while the story loads.").
		 * Defaults to `story`.
		 */
		loadingName?: string;

		/**
		 * Whether to show a pane that lists the story's headings and jumps to them.
		 *
		 * The headings come from the story's metadata (see `getStoryMetadata()`), so the pane
		 * always matches the story's content in StoryMaps. It is not shown if the metadata
		 * could not be loaded.
		 */
		navigation?: boolean;

		/**
		 * Whether to replace the story's StoryMaps cover with our own heading.
		 *
		 * The heading shows the story's title, snippet, and cover photo (with its attribution)
		 * from `getStoryMetadata()`, so it is shown while the rest of the story loads.
		 * It does not show the byline or published date. If the metadata cannot be loaded,
		 * the StoryMaps cover is shown instead. Turn it off to use a custom cover
		 * from `onStoryLoaded` instead.
		 */
		heading?: boolean;

		/**
		 * Components to mount in place of placeholder code blocks in the story.
		 *
		 * A code block in StoryMaps that contains `{ "type": "mount", "component": "Name" }`
		 * is replaced with the component named `Name`. Placeholders are replaced whenever they
		 * appear, so blocks that StoryMaps renders (or re-renders) after the story loads are included.
		 */
		components?: Record<string, Component>;

		/**
		 * Optional class to apply to the root element of the component.
		 *
		 * It is rendered into the prerendered HTML, so it can be used for styles
		 * (such as the color scheme) that must apply before the story loads.
		 */
		class?: string;
	} = $props();

	let loaded = $state(false);
	let article = $state<HTMLElement | null>(null);
	let wrapper = $state<HTMLDivElement>();
	let metadata = $state<StoryMaps.StoryHeaderMetadata | null>(null);

	$effect(() => {
		let cancelled = false;
		story?.metadata.then((result) => {
			if (!cancelled) metadata = result;
		});
		return () => {
			cancelled = true;
		};
	});

	const showHeading = $derived(heading && !!metadata);

	/** The URL's hash, including after a shallow navigation (such as from the navigation pane). */
	const hash = $derived((page.shallow?.url ?? page.url).hash);

	/** The section of the story that the URL links to, if it is one of the story's headings. */
	const linkedHeading = $derived.by(() => {
		const id = decodeHash(hash);
		return id ? metadata?.headings.find((heading) => heading.id === id) : undefined;
	});

	/**
	 * Returns the ID of the story block that a URL hash links to.
	 * StoryMaps links to blocks as `#ref-<id>`, so that form is also accepted.
	 */
	function decodeHash(hash: string) {
		let id = hash.slice(1);
		try {
			id = decodeURIComponent(id);
		} catch {
			// use the hash as it is
		}
		return id.replace(/^ref-(?=n-)/, '');
	}

	/**
	 * Removes the origin from an href value.
	 */
	function removeOriginFromHref(href: string) {
		const url = new URL(href, 'https://link.local');
		url.host = location.host;
		const pathname = url.toString().slice(url.origin.length + 1);
		return resolve(...([pathname] as Parameters<typeof resolve>));
	}

	// convert https://link.local links to links that are for the current host
	function convertLocalLinks(node: HTMLElement) {
		const links = node.querySelectorAll<HTMLAnchorElement>('a[href^="https://link.local"]');
		for (const link of links) {
			link.href = removeOriginFromHref(link.href);
			link.target = '_self'; // open in the same tab, not a new one
			link.dataset.localLink = '';
		}
	}

	// navigate with the SvelteKit router instead of reloading the page
	// (it listens during capture so that the story's own click handlers, which may bypass it, do not run)
	function handleLocalLinkClick(event: MouseEvent) {
		const link = event.target instanceof Element ? event.target.closest('a') : null;
		if (!link) {
			return;
		}

		// local links may be clicked before the observer has converted them
		const isPendingLocalLink = link.href.startsWith('https://link.local');
		const isConvertedLocalLink = 'localLink' in link.dataset;
		const isLocalLink = isPendingLocalLink || isConvertedLocalLink;
		if (!isLocalLink) {
			return; // let other links behave normally
		}

		const isModified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
		if (event.button !== 0 || isModified) return; // let the browser open new tabs/windows
		event.preventDefault();
		event.stopPropagation();
		goto(isPendingLocalLink ? removeOriginFromHref(link.href) : link.getAttribute('href')!);
	}

	/**
	 * Returns the component name from the text content of a code block element.
	 * @param code A StoryMap code block element.
	 */
	function readPlaceholder(code: Element) {
		const text = code.textContent?.trim();
		if (!text?.startsWith('{')) return undefined;
		try {
			const placeholder = JSON.parse(text);
			if (placeholder?.type === 'mount' && typeof placeholder.component === 'string') {
				return placeholder.component as string;
			}
		} catch {
			// it is an ordinary code block
		}
		return undefined;
	}

	/**
	 * Replaces placeholder code blocks with their components.
	 */
	function mountComponents(
		article: HTMLElement,
		mounted: Map<HTMLElement, ReturnType<typeof mount>>
	) {
		// unmount components whose block was removed
		for (const [target, instance] of mounted) {
			if (target.isConnected) {
				continue;
			}
			unmount(instance);
			mounted.delete(target);
		}

		// mount provided components into matching code blocks
		// embedded in the story
		for (const code of article.querySelectorAll('pre > code')) {
			const name = readPlaceholder(code);
			const container = code.parentElement?.parentElement;
			if (!name || !container || container === article) {
				continue;
			}

			const component = components[name];
			if (!component) {
				console.error(`No component named ${name} was provided to mount in the story.`);
				continue;
			}

			const target = document.createElement('div');
			target.style.margin = '0 auto';
			container.replaceChildren(target);
			mounted.set(target, mount(component, { target }));
		}
	}

	/**
	 * Converts links and mounts components in the story, including in content
	 * that StoryMaps renders or re-renders later. To make this possible, this
	 * function registers mutation observers on the story.
	 */
	function enhanceStory(article: HTMLElement) {
		const mounted = new Map<HTMLElement, ReturnType<typeof mount>>();
		const enhance = () => {
			convertLocalLinks(article);
			mountComponents(article, mounted);
		};
		enhance();

		// enhance at most once per frame, since our own changes are also observed
		let frame: number | undefined;
		const observer = new MutationObserver(() => {
			frame ??= requestAnimationFrame(() => {
				frame = undefined;
				enhance();
			});
		});
		observer.observe(article, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['href']
		});
		article.addEventListener('click', handleLocalLinkClick, true);

		return () => {
			observer.disconnect();
			if (frame !== undefined) cancelAnimationFrame(frame);
			article.removeEventListener('click', handleLocalLinkClick, true);
			for (const instance of mounted.values()) unmount(instance);
		};
	}

	/**
	 * Lists smaller versions of a StoryMaps image resource, which can be requested
	 * at a given width with the `w` parameter.
	 */
	function createSrcset(image: NonNullable<StoryMaps.StoryHeaderMetadata['image']>) {
		if (!image.width) return undefined;
		const widths = [800, 1600, 2400].filter((width) => width < image.width!);
		return [
			...widths.map((width) => {
				const url = new URL(image.href);
				url.searchParams.set('w', width.toString());
				return `${url} ${width}w`;
			}),
			`${image.href} ${image.width}w`
		].join(', ');
	}

	/**
	 * Scrolls to the element in the story that the URL hash links to (such as a heading).
	 *
	 * It scrolls again once the story has finished animating in, since that moves it.
	 */
	async function scrollToHash() {
		const id = decodeHash(location.hash);
		if (!id) return;
		await tick();
		const scroll = () => {
			const target = article?.ownerDocument.getElementById(id);
			if (target && article?.contains(target)) scrollToElement(target);
		};
		requestAnimationFrame(scroll);
		setTimeout(scroll, 250);
	}

	let resolveNavigated!: () => void;
	/** Resolves once it is known how the page was shown (see `restoring`). */
	const navigated = new Promise<void>((resolve) => (resolveNavigated = resolve));

	/**
	 * Whether the reader will be returned to where they were in the story once it loads,
	 * which is when they return to the page (by going back or forward in the browser's
	 * history or by reloading it) and a position was remembered.
	 */
	let restoring = $state(false);

	// going to a section of the story while it loads takes the reader there instead
	const initialHash = page.url.hash;
	$effect(() => {
		if (hash !== initialHash) {
			restoring = false;
		}
	});

	/** Whether the reader is navigating to another page, which scrolls this one before it is removed. */
	let leaving = false;
	let saveTimeout: ReturnType<typeof setTimeout> | undefined;

	let navigatedOnce = false;
	afterNavigate((navigation) => {
		leaving = false;

		if (navigatedOnce) {
			return;
		}
		navigatedOnce = true;

		const entry = performance.getEntriesByType('navigation')[0] as
			PerformanceNavigationTiming | undefined;
		const returning =
			navigation.type === 'popstate' ||
			(navigation.type === 'enter' && (entry?.type === 'back_forward' || entry?.type === 'reload'));
		restoring = returning && !!story && hasScrollPosition(story.storyId);
		resolveNavigated();
	});

	// remember where the reader was in the story right before they leave it
	beforeNavigate((navigation) => {
		if (navigation.to?.url.pathname === page.url.pathname) {
			// moving between sections of the story stays on the page
			return;
		}

		clearTimeout(saveTimeout);
		if (loaded && article && story) {
			saveScrollPosition(story.storyId, article);
		}
		leaving = true;
	});

	// remember where the reader is in the story as they scroll, in case they leave the site
	function onScroll() {
		if (!loaded || leaving) {
			return;
		}

		clearTimeout(saveTimeout);
		saveTimeout = setTimeout(() => {
			if (!leaving && article && story) {
				saveScrollPosition(story.storyId, article);
			}
		}, 200);
	}

	// move the story from the off-screen container into this page
	function adopt(slot: HTMLDivElement) {
		if (!story) {
			return;
		}
		const host = story.host;
		host.style.setProperty('--loading-height', loadingHeight ?? '100dvh');
		slot.appendChild(host);
		// the page is shown, so its URL matches and the story may load (if it has not already)
		story.adopted = true;
		story.start();

		let cancelled = false;
		let stopLinkingGlossaryTerms: (() => void) | undefined;
		let stopEnhancing: (() => void) | undefined;
		const markLoaded = (storyArticle: HTMLElement | null) => {
			if (cancelled || !storyArticle) return;
			loaded = true;
			article = storyArticle;
			stopEnhancing = enhanceStory(storyArticle);
			onStoryLoaded?.(storyArticle);

			// return to where the reader was when going back (or forward) to the story or
			// reloading it, and otherwise go to the section in the URL
			navigated.then(() => {
				if (cancelled) return;
				if (!restoring || !restoreScrollPosition(story.storyId, storyArticle)) scrollToHash();
			});

			// link glossary terms in the story, including any content injected by `onStoryLoaded`
			fetchGlossary()
				.then((glossary) => {
					if (cancelled) return;
					stopLinkingGlossaryTerms = linkGlossaryTerms(storyArticle, glossary);
				})
				.catch((error) => console.error('Glossary terms could not be linked:', error));
		};
		if (story.article) markLoaded(story.article);
		else story.ready.then(markLoaded);

		return () => {
			cancelled = true;
			clearTimeout(saveTimeout);
			stopLinkingGlossaryTerms?.();
			stopEnhancing?.();
			story.dispose();
		};
	}

	$effect(() => {
		story?.host.classList.toggle('loaded', loaded);
	});

	// our heading replaces the StoryMaps cover
	$effect(() => {
		story?.host.classList.toggle('hide-cover', showHeading);
	});

	/**
	 * Content flies into the page like the story does when it loads (see `.storymap-embed > *`).
	 */
	const ENTER_DURATION = 210;
	const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
	const flyIn = (node: Element) =>
		fly(node, { y: 40, duration: reduceMotion() ? 0 : ENTER_DURATION, easing: expoOut });
	const fadeOut = (node: Element) =>
		fade(node, { duration: reduceMotion() ? 0 : ENTER_DURATION, easing: expoOut });

	// on Alt + Shift + E, launch the StoryMaps editor for the current StoryMap
	function openEditor(event: KeyboardEvent) {
		if (!story) return;
		if (
			event.altKey &&
			event.shiftKey &&
			(event.key.toLowerCase() === 'e' || event.code === 'KeyE')
		) {
			event.preventDefault();
			window.open(
				`https://storymaps.arcgis.com/stories/${story.storyId}/edit`,
				`storymap-editor-${story.storyId}`,
				`popup,width=1600,height=1000`
			);
			window.open(`/.api/editor${window.location.pathname}`, '_blank', 'width=1600,height=1000');
		}
	}
</script>

<svelte:window onkeydown={openEditor} onscroll={onScroll} />

{#snippet loadingMessage()}
	<ProgressRing></ProgressRing>
	<span>Please wait while the {loadingName} loads.</span>
	{#if restoring}
		<span>You will be returned to where you left off in a moment.</span>
	{:else if linkedHeading}
		<span>You will be brought to “{linkedHeading.text}” in a moment.</span>
	{:else if hash.length > 1}
		<span>You will be brought to the section in a moment.</span>
	{:else}
		<span>This may take a few seconds.</span>
	{/if}
{/snippet}

<div class="storymap-embed-wrapper {className ?? ''}" bind:this={wrapper}>
	{#if showHeading && metadata}
		<div in:flyIn>
			<StoryHeading
				title={metadata.title}
				summary={metadata.snippet || undefined}
				image={metadata.image
					? {
							src: metadata.image.href,
							srcset: createSrcset(metadata.image),
							alt: metadata.image.alt,
							attribution: metadata.image.attribution ?? undefined
						}
					: undefined}
			/>
		</div>
	{/if}
	<!-- reserve the loading height up front, since the story is only added to the page after it mounts -->
	<div class="storymap-area" style:min-height={loaded ? undefined : (loadingHeight ?? '100dvh')}>
		<div class="storymap-slot" {@attach adopt}></div>
		{#if !loaded && showHeading}
			<!-- below the heading, the message is shown right away instead of in the middle of the space for the story -->
			<div class="loading-message below-heading" in:flyIn>
				{@render loadingMessage()}
			</div>
		{/if}
	</div>
	{#if !loaded && !showHeading}
		<!-- it stays where it is (over the top of the page) while it fades out as the heading or story enters -->
		<div class="loading-message centered" style:height={loadingHeight ?? '100dvh'} out:fadeOut>
			{@render loadingMessage()}
		</div>
	{/if}
	{#if navigation && wrapper && metadata}
		<StoryNavigation container={wrapper} title={metadata.title} headings={metadata.headings} />
	{/if}
</div>

<style>
	.storymap-embed-wrapper {
		position: relative;
	}

	.storymap-area {
		position: relative;
	}

	.loading-message {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 0 1rem;
	}
	.loading-message.centered {
		top: 0;
		left: 0;
		right: 0;
		background-color: light-dark(#f5f9ff, #212121);
	}
	.loading-message.below-heading {
		inset: 0;
		justify-content: flex-start;
		padding-top: clamp(1.5rem, 4vw, 2.5rem);
		background-color: var(--color-surface);
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

	:global(.storymap-embed.hide-cover article.story > :first-child) {
		display: none;
	}

	/* leave room below the titlebar when jumping to a heading */
	:global(.storymap-embed [data-testid='Heading']),
	:global(.storymap-embed article.story [id^='n-']) {
		scroll-margin-top: calc(var(--header-height) + 1.5rem);
	}

	:global(.storymap-embed) :global(> *) {
		opacity: 0;
		transform: translateY(40px);
		transition:
			opacity 210ms cubic-bezier(0.16, 1, 0.3, 1),
			transform 210ms cubic-bezier(0.16, 1, 0.3, 1);
	}
	/* end at `none` since any transform would make it the containing block
	for StoryMaps' fixed fullscreen maps, which would break the fullscreen
	button functionality */
	:global(.storymap-embed.loaded) :global(> *) {
		transform: none;
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
		--sm-web-theme-border-radius-regular: var(--radius-button);
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
		text-decoration-color: var(--color-accent);
		text-underline-offset: 0.2em;
		cursor: help;
	}
	:global(.storymap-embed a.glossary-term:hover) {
		text-decoration-style: solid;
		color: var(--color-accent);
	}

	:global(#storymaps-root) {
		--sm-story-theme-spacing-xxs: calc(
			var(--sm-story-theme-spacing-xxs-raw) * var(--storymaps-spacing-scale, 1)
		);
		--sm-story-theme-spacing-xxs-raw: 1.6rem;
	}
</style>
