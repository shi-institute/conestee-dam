<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { scale, slide } from 'svelte/transition';

	const {
		article
	}: {
		/** The story article in which we should search for headings. */
		article: HTMLElement;
	} = $props();

	interface StoryHeading {
		element: HTMLElement;
		text: string;
		level: number;
	}

	/**
	 * Collects the headings that the story author added in StoryMaps
	 * (not the story title or mounted components).
	 */
	function collectHeadings(article: HTMLElement): StoryHeading[] {
		return Array.from(article.querySelectorAll<HTMLElement>('[data-testid="Heading"]'))
			.map((element) => ({
				element,
				text: element.textContent?.trim().replace(/\s+/g, ' ') ?? '',
				level: Number(element.tagName.slice(1)) || 2
			}))
			.filter((heading) => heading.text && heading.element.getClientRects().length > 0);
	}

	function isSameHeadings(a: StoryHeading[], b: StoryHeading[]) {
		return (
			a.length === b.length &&
			a.every(
				(heading, index) => heading.element === b[index].element && heading.text === b[index].text
			)
		);
	}

	let headings = $state.raw<StoryHeading[]>([]);
	let activeIndex = $state(-1);
	const topLevel = $derived(Math.min(...headings.map((heading) => heading.level)));

	// collect the headings from the story, and collect them again whenever the story changes
	// (such as when StoryMaps renders more of the story, content is injected into it,
	// or its images load and change its layout)
	$effect(() => {
		let frame = 0;
		const update = () => {
			frame = 0;
			const next = collectHeadings(article);
			if (!isSameHeadings(headings, next)) headings = next;
			measureMargin();
			updateWideElements();
			updateActiveHeading();
		};
		update();

		const observer = new MutationObserver(() => {
			if (!frame) frame = requestAnimationFrame(update);
		});
		observer.observe(article, { childList: true, subtree: true, characterData: true });
		const resizeObserver = new ResizeObserver(() => {
			if (!frame) frame = requestAnimationFrame(update);
		});
		resizeObserver.observe(article);
		// images (such as floated ones) can change size when they load without resizing the story
		const onLoad = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};
		article.addEventListener('load', onLoad, true);

		return () => {
			observer.disconnect();
			resizeObserver.disconnect();
			article.removeEventListener('load', onLoad, true);
			cancelAnimationFrame(frame);
		};
	});

	/** The active heading is the last one that has been scrolled into the top part of the viewport. */
	function updateActiveHeading() {
		const threshold = window.innerHeight * 0.35;
		let index = -1;
		for (let i = 0; i < headings.length; i++) {
			if (headings[i].element.getBoundingClientRect().top > threshold) break;
			index = i;
		}
		activeIndex = index;
	}

	let scrollFrame = 0;
	function onScroll() {
		if (scrollFrame) return;
		scrollFrame = requestAnimationFrame(() => {
			scrollFrame = 0;
			updateActiveHeading();
		});
	}

	function onResize() {
		measureMargin();
		updateWideElements();
		viewportHeight = window.innerHeight;
		onScroll();
	}

	/** The width of the margin to the right of the story's text column, in pixels. */
	let margin = $state(0);
	let rem = $state(16);

	// StoryMaps sizes the text column itself (and it scales with the text size),
	// so the margin is measured instead of assumed
	function measureMargin() {
		const column = article.querySelector('.text-container') ?? headings[0]?.element;
		margin = column
			? document.documentElement.clientWidth - column.getBoundingClientRect().right
			: 0;
		rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
	}

	/** The pane fills the margin, leaving a gap on either side of it. */
	const paneWidth = $derived(Math.min(margin - 2 * rem, 16 * rem));
	const fitsBeside = $derived(paneWidth >= 10 * rem);

	let pane = $state<HTMLElement>();
	let paneHeight = $state(0);
	let viewportHeight = $state(window.innerHeight);

	/** Elements in the story that reach under the pane, such as wide and full-width media. */
	let wideElements = $state.raw<Element[]>([]);
	const MEDIA = 'img, video, canvas, iframe, svg, picture';

	/**
	 * Finds the outermost visible elements in the story (including content injected into it)
	 * that extend past the left edge of the pane.
	 *
	 * Wrappers that are wide but only contain narrow content (such as the story's text column)
	 * are skipped, since nothing in them is under the pane. Wrappers that are wide and have
	 * their own background (such as the sidecar in an injected infographic) are counted.
	 *
	 * Narrow elements are still searched, since their content can extend past them (such as
	 * images floated into the margin or injected content that breaks out of the text column).
	 * Content that is clipped by its container is handled by the intersection observer.
	 */
	function collectWideElements(): Element[] {
		const edge = document.documentElement.clientWidth - rem - paneWidth;
		const pageBackground = getBackdropColor(article);
		const elements: Element[] = [];
		const visit = (parent: Element) => {
			for (const child of parent.children) {
				const rect = child.getBoundingClientRect();
				const isWide = rect.right > edge && rect.width > 0 && rect.height > 0;
				if (isWide && !child.checkVisibility({ visibilityProperty: true })) continue;
				if (isWide && (child.matches(MEDIA) || hasBackground(child, pageBackground))) {
					elements.push(child);
				} else if (child.childElementCount > 0) visit(child);
				else if (isWide && child.textContent?.trim()) elements.push(child);
			}
		};
		visit(article);
		return elements;
	}

	const TRANSPARENT = 'rgba(0, 0, 0, 0)';

	/** The color behind an element, from the nearest element (or ancestor) that has a background color. */
	function getBackdropColor(element: Element) {
		for (let current: Element | null = element; current; current = current.parentElement) {
			const color = getComputedStyle(current).backgroundColor;
			if (color !== TRANSPARENT) return color;
		}
		return TRANSPARENT;
	}

	/** Whether an element has a background that stands out from the page behind the story. */
	function hasBackground(element: Element, pageBackground: string) {
		const style = getComputedStyle(element);
		return (
			style.backgroundImage !== 'none' ||
			(style.backgroundColor !== TRANSPARENT && style.backgroundColor !== pageBackground)
		);
	}

	function updateWideElements() {
		if (!fitsBeside) {
			if (wideElements.length > 0) wideElements = [];
			return;
		}
		const next = collectWideElements();
		const isSame =
			next.length === wideElements.length &&
			next.every((element, index) => element === wideElements[index]);
		if (!isSame) wideElements = next;
	}

	/** Whether any wide elements are under the pane, which is when it fades so they can be seen. */
	let overlapping = $state(false);

	// watch for wide elements in the band of the viewport that the pane covers
	$effect(() => {
		void paneHeight;
		void viewportHeight;
		const rect = pane?.getBoundingClientRect();
		if (!rect || rect.height === 0 || wideElements.length === 0) {
			overlapping = false;
			return;
		}

		const intersecting = new Set<Element>();
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) intersecting.add(entry.target);
					else intersecting.delete(entry.target);
				}
				overlapping = intersecting.size > 0;
			},
			{ rootMargin: `${-rect.top}px 0px ${-(viewportHeight - rect.bottom)}px 0px` }
		);
		for (const element of wideElements) observer.observe(element);
		return () => observer.disconnect();
	});

	let popover = $state<HTMLElement>();

	// remember whether the pane was collapsed so that it stays that way on other stories
	const COLLAPSED_KEY = 'story-navigation-collapsed';
	let collapsed = $state(readCollapsed());

	function readCollapsed() {
		try {
			return localStorage.getItem(COLLAPSED_KEY) === 'true';
		} catch {
			return false;
		}
	}

	/** Whether the pane has been opened or closed since it was shown, which is when it animates. */
	let toggled = $state(false);

	/** The width of the "Contents" label, so the closed pane can be sized (and animated) to fit it. */
	let labelWidth = $state(0);
	const collapsedWidth = $derived(labelWidth + 3 * rem);

	const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
	const PANE_DURATION = 250;

	function toggleCollapsed() {
		toggled = true;
		collapsed = !collapsed;
		try {
			localStorage.setItem(COLLAPSED_KEY, String(collapsed));
		} catch {
			// the pane still collapses; it just will not be remembered
		}
	}

	function jumpTo(event: MouseEvent, heading: StoryHeading) {
		const isModified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
		if (event.button !== 0 || isModified) return;
		event.preventDefault();
		heading.element.scrollIntoView({
			behavior: reduceMotion() ? 'auto' : 'smooth',
			block: 'start'
		});
		if (popover?.matches(':popover-open')) popover.hidePopover();
	}
</script>

<svelte:window onscroll={onScroll} onresize={onResize} />

{#snippet list()}
	<ol>
		{#each headings as heading, index (heading.element)}
			<li style:--depth={heading.level - topLevel}>
				<a
					href="#{heading.element.id}"
					aria-current={index === activeIndex ? 'location' : undefined}
					onclick={(event) => jumpTo(event, heading)}
				>
					{heading.text}
				</a>
			</li>
		{/each}
	</ol>
{/snippet}

{#if headings.length > 0 && fitsBeside}
	<!-- shown beside the story when there is room for it -->
	<nav
		class="story-navigation pane"
		class:collapsed
		class:toggled
		class:overlapping
		aria-label="Story sections"
		bind:this={pane}
		bind:offsetHeight={paneHeight}
		style:width="{collapsed ? collapsedWidth : paneWidth}px"
		style:--duration="{PANE_DURATION}ms"
	>
		<h2>
			<button
				class="collapse"
				type="button"
				aria-expanded={!collapsed}
				aria-controls="story-navigation-pane-list"
				onclick={toggleCollapsed}
			>
				<span bind:offsetWidth={labelWidth}>Contents</span>
				{#key collapsed}
					<svg
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
						in:scale={{
							start: 0.5,
							duration: reduceMotion() ? 0 : PANE_DURATION,
							easing: cubicOut
						}}
					>
						{#if collapsed}
							<path
								d="M15.53 4.22a.75.75 0 0 0-1.06 0l-7.25 7.25a.75.75 0 0 0 0 1.06l7.25 7.25a.75.75 0 0 0 1.06-1.06L8.81 12l6.72-6.72a.75.75 0 0 0 0-1.06Z"
								fill="currentColor"
							/>
						{:else}
							<path
								d="M5.22 5.22a.75.75 0 0 1 1.06 0L12 10.94l5.72-5.72a.75.75 0 1 1 1.06 1.06L13.06 12l5.72 5.72a.75.75 0 1 1-1.06 1.06L12 13.06l-5.72 5.72a.75.75 0 0 1-1.06-1.06L10.94 12 5.22 6.28a.75.75 0 0 1 0-1.06Z"
								fill="currentColor"
							/>
						{/if}
					</svg>
				{/key}
			</button>
		</h2>
		{#if !collapsed}
			<!-- the list keeps its width while the pane narrows, so its text does not rewrap -->
			<div
				id="story-navigation-pane-list"
				class="pane-list"
				style:width="{paneWidth}px"
				transition:slide={{ duration: reduceMotion() ? 0 : PANE_DURATION, easing: cubicOut }}
			>
				{@render list()}
			</div>
		{/if}
	</nav>
{:else if headings.length > 0}
	<!-- otherwise, shown in a popover -->
	<button class="toggle" type="button" popovertarget="story-navigation-popover">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
			<path
				d="M3.75 5.5h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1 0-1.5Zm4 6h12.5a.75.75 0 0 1 0 1.5H7.75a.75.75 0 0 1 0-1.5Zm0 6h12.5a.75.75 0 0 1 0 1.5H7.75a.75.75 0 0 1 0-1.5Z"
				fill="currentColor"
			/>
		</svg>
		Contents
	</button>
	<nav
		class="story-navigation popover"
		id="story-navigation-popover"
		aria-label="Story sections"
		popover="auto"
		bind:this={popover}
	>
		<h2>Contents</h2>
		{@render list()}
	</nav>
{/if}

<style>
	.story-navigation {
		box-sizing: border-box;
		background-color: light-dark(#ffffffe8, #212121e8);
		backdrop-filter: blur(14px);
		border-radius: var(--radius-surface);
		color: light-dark(#222, #eee);
		font-family: greycliff-cf, sans-serif;
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	h2 {
		margin: 0 0 0.5rem;
		padding: 0 0.75rem;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: light-dark(#555, #aaa);
	}

	ol {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	a {
		display: block;
		padding: 0.375rem 0.75rem;
		padding-left: calc(0.75rem + var(--depth, 0) * 0.875rem);
		border-left: 2px solid transparent;
		color: inherit;
		font-size: 0.875rem;
		line-height: 1.3;
		text-decoration: none;
	}
	a:hover {
		color: var(--color-accent);
		text-decoration: underline;
	}
	a[aria-current] {
		color: var(--color-accent);
		border-left-color: var(--color-accent);
		font-weight: 700;
	}
	a:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: -2px;
	}

	/* the pane sits in the margin to the right of the story's text column */
	.pane {
		position: fixed;
		top: calc(var(--header-height) + 1.5rem);
		right: 1rem;
		z-index: 3;
		max-height: calc(100dvh - var(--header-height) - 3rem);
		padding: 0.75rem 0;
		overflow-x: hidden;
	}
	.pane h2 {
		margin-bottom: 0;
	}
	.pane-list {
		padding-top: 0.5rem;
	}
	.pane.collapsed {
		padding: 0.25rem 0;
	}
	/* fade the pane when it covers wide content, unless it is being used */
	.pane.overlapping:not(:hover, :focus-within) {
		background-color: light-dark(#ffffff1a, #2121211a);
		backdrop-filter: none;
	}
	.pane.overlapping:not(:hover, :focus-within) .pane-list {
		opacity: 0.1;
	}
	@media (prefers-reduced-motion: no-preference) {
		.pane {
			transition: background-color 200ms cubic-bezier(0.215, 0.61, 0.355, 1);
		}
		.pane-list {
			transition: opacity 200ms cubic-bezier(0.215, 0.61, 0.355, 1);
		}
		.pane.toggled {
			transition:
				width var(--duration) cubic-bezier(0.215, 0.61, 0.355, 1),
				padding var(--duration) cubic-bezier(0.215, 0.61, 0.355, 1),
				background-color 200ms cubic-bezier(0.215, 0.61, 0.355, 1);
		}
	}

	.collapse {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		width: 100%;
		margin: 0;
		padding: 0.25rem 0;
		border: none;
		background: none;
		color: inherit;
		font: inherit;
		letter-spacing: inherit;
		text-transform: inherit;
		cursor: pointer;
	}
	.collapse:hover {
		color: var(--color-accent);
	}
	.collapse:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
		border-radius: var(--radius-button);
	}
	.collapse svg {
		width: 1rem;
		height: 1rem;
	}

	.toggle {
		position: fixed;
		right: 1rem;
		bottom: calc(1rem + env(safe-area-inset-bottom));
		z-index: 3;
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 0.875rem;
		border: 1px solid light-dark(#d6e2f5, #3a3a3a);
		border-radius: 999px;
		background-color: light-dark(#f5f9ffe8, #212121e8);
		backdrop-filter: blur(14px);
		box-shadow: 0 2px 8px rgb(0 0 0 / 0.15);
		color: var(--color-accent);
		font:
			600 0.875rem greycliff-cf,
			sans-serif;
		cursor: pointer;
	}
	.toggle svg {
		width: 1.125rem;
		height: 1.125rem;
	}

	.popover {
		position: fixed;
		inset: auto 1rem calc(4rem + env(safe-area-inset-bottom)) auto;
		width: min(20rem, calc(100vw - 2rem));
		max-height: calc(100dvh - var(--header-height) - 5rem - env(safe-area-inset-bottom));
		margin: 0;
		padding: 0.75rem 0;
		box-shadow: 0 4px 16px rgb(0 0 0 / 0.2);
		background-color: light-dark(#f5f9ffe8, #212121e8);
		border: 1px solid light-dark(#d6e2f5, #3a3a3a);
	}
	@media (prefers-reduced-motion: no-preference) {
		.popover {
			transform-origin: bottom right;
			transition:
				opacity 167ms cubic-bezier(0.215, 0.61, 0.355, 1),
				transform 167ms cubic-bezier(0.215, 0.61, 0.355, 1),
				overlay 167ms allow-discrete,
				display 167ms allow-discrete;
		}
		.popover:not(:popover-open) {
			opacity: 0;
			transform: scale(0.95) translateY(0.5rem);
		}
		@starting-style {
			.popover:popover-open {
				opacity: 0;
				transform: scale(0.95) translateY(0.5rem);
			}
		}
	}

	/* leave room below the titlebar when jumping to a heading */
	:global(.storymap-embed [data-testid='Heading']) {
		scroll-margin-top: calc(var(--header-height) + 1.5rem);
	}
</style>
