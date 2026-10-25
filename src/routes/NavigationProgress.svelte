<script lang="ts">
	import { beforeNavigate, goto, preloadData } from '$app/navigation';
	import { disposeStaleStories } from '$lib/components';
	import { navigating } from '$app/state';

	/** Navigations that finish faster than this do not show any progress. */
	const SHOW_DELAY_MS = 100;
	const TICK_MS = 100;
	/** The most progress that is shown before the navigation actually finishes. */
	const MAX_PENDING_PROGRESS = 0.92;
	const FINISH_DURATION_MS = 250;
	/** How long going back or forward waits for SvelteKit to start navigating before giving up. */
	const TRAVERSAL_CLAIM_MS = 250;

	let visible = $state(false);
	let progress = $state(0);

	let showTimeout: ReturnType<typeof setTimeout> | undefined;
	let tickInterval: ReturnType<typeof setInterval> | undefined;
	let finishTimeout: ReturnType<typeof setTimeout> | undefined;

	/**
	 * The Navigation API is not in every browser's type definitions yet.
	 * We only use the parts below.
	 */
	interface NavigateEvent extends Event {
		navigationType: string;
		canIntercept: boolean;
		intercept(options: {
			handler: () => Promise<void>;
			focusReset: 'manual';
			scroll: 'manual';
		}): void;
	}

	function getNavigation() {
		return (window as { navigation?: EventTarget }).navigation;
	}

	/** Finishes the navigation that keeps the browser's own loading indicator showing. */
	let releaseNativeIndicator: (() => void) | undefined;

	/**
	 * Runs `changeUrl` (which must change the URL with the History API) and makes the browser
	 * show its own page loading indicator (such as the spinner in the tab) until
	 * `stopNativeIndicator()` is called or another navigation starts.
	 *
	 * Browsers show it while a same-document navigation in the top-level page that was
	 * intercepted by the Navigation API is pending, so we intercept the navigation that the
	 * History API call starts. Unlike `navigation.navigate()`, that keeps the state that
	 * SvelteKit needs on the history entry. Without the Navigation API, it only changes the URL.
	 */
	function withNativeIndicator(changeUrl: () => void) {
		const navigation = getNavigation();
		if (!navigation) {
			changeUrl();
			return;
		}

		let release!: () => void;
		const hold = new Promise<void>((resolve) => (release = resolve));
		const onNavigate = (event: Event) => {
			const navigateEvent = event as NavigateEvent;
			if (!navigateEvent.canIntercept) return;
			navigateEvent.intercept({ handler: () => hold, focusReset: 'manual', scroll: 'manual' });
		};

		// the History API fires the navigate event synchronously
		navigation.addEventListener('navigate', onNavigate);
		try {
			changeUrl();
		} finally {
			navigation.removeEventListener('navigate', onNavigate);
		}

		// the new navigation aborted the previous one, so release it as well
		releaseNativeIndicator?.();
		releaseNativeIndicator = release;
	}

	function stopNativeIndicator() {
		releaseNativeIndicator?.();
		releaseNativeIndicator = undefined;
	}

	/** Finishes the intercepted back or forward navigation. */
	let traversal: { release: () => void; claimed: boolean } | undefined;

	/** Whether this component is going back itself (to leave the placeholder entry). */
	let removingPlaceholder = false;

	/**
	 * Makes the browser show its own loading indicator while going back and forward, too.
	 *
	 * The traversal is intercepted and held until SvelteKit's navigation to the page completes
	 * (see `beforeNavigate`). If SvelteKit does not navigate (for example, when only the hash
	 * changes), it is released after a moment.
	 */
	function onTraverse(event: Event) {
		const navigateEvent = event as NavigateEvent;
		if (navigateEvent.navigationType !== 'traverse' || !navigateEvent.canIntercept) return;
		if (removingPlaceholder) return;

		traversal?.release();
		let release!: () => void;
		const hold = new Promise<void>((resolve) => (release = resolve));
		const current = {
			release: () => {
				if (traversal === current) traversal = undefined;
				release();
			},
			claimed: false
		};
		traversal = current;
		setTimeout(() => {
			if (!current.claimed) current.release();
		}, TRAVERSAL_CLAIM_MS);

		navigateEvent.intercept({ handler: () => hold, focusReset: 'manual', scroll: 'manual' });
	}

	$effect(() => {
		const navigation = getNavigation();
		navigation?.addEventListener('navigate', onTraverse);
		return () => {
			navigation?.removeEventListener('navigate', onTraverse);
			traversal?.release();
		};
	});

	/**
	 * The key that SvelteKit's router stores its metadata under in `history.state`. It lets it
	 * recognize a history entry as its own, so going forward to the placeholder entry below
	 * runs a normal navigation.
	 */
	const HISTORY_METADATA = 'sveltekit:metadata';

	/**
	 * The navigation to a story page that is loading, whose URL is already in the address bar
	 * (as a placeholder history entry) while the current page is still shown.
	 */
	let pending: { href: string } | undefined;

	/** Whether two URLs are the same page, ignoring a trailing slash (links have none, but pages do). */
	function isSamePage(a: URL, b: URL | Location) {
		const normalize = (pathname: string) => pathname.replace(/\/+$/, '') || '/';
		return normalize(a.pathname) === normalize(b.pathname) && a.search === b.search;
	}

	/** The URL of a navigation that this component started itself, which must not be intercepted. */
	let ownNavigationHref: string | undefined;

	/** Whether a story is loading before SvelteKit has started the navigation to it. */
	let waiting = $state(false);

	function pushPlaceholderEntry(url: URL) {
		const metadata = history.state?.[HISTORY_METADATA] ?? {};
		const placeholderState = {
			[HISTORY_METADATA]: {
				historyIndex: (metadata.historyIndex ?? 0) + 1,
				navigationIndex: (metadata.navigationIndex ?? 0) + 1,
				// an empty page state, serialized the way SvelteKit serializes it
				state: '[{}]',
				persistState: false,
				resetIndex: (metadata.resetIndex ?? 0) + 1
			}
		};
		// call the original method so that SvelteKit does not warn about direct usage
		History.prototype.pushState.call(history, placeholderState, '', url);
	}

	function replacePlaceholderEntry(url: URL) {
		History.prototype.replaceState.call(history, history.state, '', url);
	}

	/** Leaves the placeholder entry, which the real navigation will replace with a new entry. */
	function removePlaceholderEntry() {
		return new Promise<void>((resolve) => {
			const done = () => {
				removingPlaceholder = false;
				clearTimeout(timeout);
				removeEventListener('popstate', done);
				resolve();
			};
			const timeout = setTimeout(done, 500);
			addEventListener('popstate', done, { once: true });
			removingPlaceholder = true;
			history.back();
		});
	}

	async function navigateToStory(target: URL) {
		const replace = !!pending;
		withNativeIndicator(() => {
			if (replace) replacePlaceholderEntry(target);
			else pushPlaceholderEntry(target);
		});
		const current = (pending = { href: target.href });
		waiting = true;

		// the story loads as part of loading the page, so wait for that
		await preloadData(target.href).catch(() => {});
		// the user may have navigated elsewhere in the meantime
		if (pending !== current) {
			disposeStaleStories(location.pathname);
			return;
		}

		pending = undefined;
		stopNativeIndicator();
		if (location.href === target.href) await removePlaceholderEntry();
		await go(target);
	}

	async function go(target: URL) {
		ownNavigationHref = target.href;
		try {
			await goto(target);
		} catch {
			// the error page or the previous page is shown
		} finally {
			ownNavigationHref = undefined;
			waiting = false;
		}
	}

	// SvelteKit ignores going back from the placeholder entry (it never knew about it, so it
	// sees no change), so stop waiting for the story here
	function onpopstate() {
		if (!pending || location.href === pending.href) return;
		pending = undefined;
		waiting = false;
		stopNativeIndicator();
		traversal?.release();
		disposeStaleStories(location.pathname);
	}

	// Story pages take a while to load, so change the URL right away and keep showing the
	// current page until the story is ready. SvelteKit would otherwise only change the URL
	// when the new page is shown.
	beforeNavigate(async (navigation) => {
		const to = navigation.to;
		if (!to || to.url.href === ownNavigationHref) return;

		if (navigation.type === 'popstate' || navigation.type === 'leave') {
			// the user went elsewhere, so stop waiting for the story
			pending = undefined;
			waiting = false;
			stopNativeIndicator();
			if (to) disposeStaleStories(to.url.pathname);

			// keep the browser's indicator showing until the page is shown
			const current = traversal;
			if (navigation.type === 'popstate' && current) {
				current.claimed = true;
				navigation.complete.then(current.release, current.release);
			}
			return;
		}
		if (navigation.type !== 'link' && navigation.type !== 'goto') return;

		const isStory = to.route.id?.startsWith('/story') && !isSamePage(to.url, location);
		if (pending && isSamePage(to.url, new URL(pending.href))) {
			// already waiting for this page
			navigation.cancel();
			return;
		}
		if (!isStory && !pending) return;

		navigation.cancel();
		if (isStory) {
			navigateToStory(to.url);
		} else {
			// going somewhere else while a story is loading: drop the placeholder entry first
			const abandoned = pending;
			pending = undefined;
			waiting = false;
			stopNativeIndicator();
			if (abandoned && location.href === abandoned.href) await removePlaceholderEntry();
			disposeStaleStories(to.url.pathname);
			go(to.url);
		}
	});

	function start() {
		clearTimeout(finishTimeout);
		if (showTimeout || tickInterval) return;
		showTimeout = setTimeout(() => {
			showTimeout = undefined;
			visible = true;
			progress = 0.08;
			// ease toward the maximum, since the real progress of a story is not known
			tickInterval = setInterval(() => {
				progress += (MAX_PENDING_PROGRESS - progress) * 0.05;
			}, TICK_MS);
		}, SHOW_DELAY_MS);
	}

	function finish() {
		clearTimeout(showTimeout);
		showTimeout = undefined;
		if (!tickInterval) return;
		clearInterval(tickInterval);
		tickInterval = undefined;

		progress = 1;
		stopNativeIndicator();
		finishTimeout = setTimeout(() => {
			visible = false;
		}, FINISH_DURATION_MS);
	}

	$effect(() => {
		if (navigating.to || waiting) start();
		else finish();
	});

	$effect(() => () => {
		clearTimeout(showTimeout);
		clearTimeout(finishTimeout);
		clearInterval(tickInterval);
		stopNativeIndicator();
	});
</script>

<svelte:window {onpopstate} />

<div
	class="navigation-progress"
	class:visible
	role="progressbar"
	aria-label="Loading page"
	aria-valuemin="0"
	aria-valuemax="100"
	aria-valuenow={Math.round(progress * 100)}
	aria-hidden={!visible}
	style:transform="scaleX({progress})"
></div>

<style>
	.navigation-progress {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		height: 3px;
		background-color: var(--color-accent);
		transform-origin: left;
		opacity: 0;
		pointer-events: none;
		/* stay in place (instead of moving with the page) during view transitions */
		view-transition-name: navigation-progress;
		transition:
			transform 100ms linear,
			opacity 200ms ease-in-out;
	}

	.navigation-progress.visible {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.navigation-progress {
			transition: none;
		}
	}
</style>
