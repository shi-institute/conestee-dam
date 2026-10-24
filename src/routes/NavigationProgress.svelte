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
		info: unknown;
		canIntercept: boolean;
		intercept(options: {
			handler: () => Promise<void>;
			focusReset: 'manual';
			scroll: 'manual';
		}): void;
	}
	interface NavigationApi extends EventTarget {
		navigate(
			url: string,
			options: { history: 'replace'; info: unknown }
		): { finished: Promise<unknown> };
	}

	const NATIVE_INDICATOR_INFO = 'native-loading-indicator';

	let nativeIndicator: { frame: HTMLIFrameElement; release: () => void } | undefined;

	/**
	 * Makes the browser show its own page loading indicator (such as the spinner in the tab).
	 *
	 * Browsers show it while a same-document navigation that was intercepted by the
	 * Navigation API is pending. We start one inside a hidden iframe, so that nothing
	 * about the real page or its history (which SvelteKit relies on) is touched,
	 * and keep it pending until the real navigation is ready. It does nothing
	 * in browsers without the Navigation API.
	 */
	async function startNativeIndicator() {
		if (!('navigation' in window) || nativeIndicator) return;

		const frame = document.createElement('iframe');
		frame.hidden = true;
		frame.tabIndex = -1;
		frame.setAttribute('aria-hidden', 'true');
		frame.srcdoc = '';
		let release!: () => void;
		const hold = new Promise<void>((resolve) => (release = resolve));
		nativeIndicator = { frame, release };

		document.body.appendChild(frame);
		await new Promise((resolve) => frame.addEventListener('load', resolve, { once: true }));

		// the navigation may have finished while the frame was loading
		if (nativeIndicator?.frame !== frame) return;
		const frameWindow = frame.contentWindow as unknown as {
			navigation?: NavigationApi;
			location: Location;
		} | null;
		const frameNavigation = frameWindow?.navigation;
		if (!frameWindow || !frameNavigation) return;

		frameNavigation.addEventListener('navigate', (event) => {
			const navigateEvent = event as NavigateEvent;
			if (navigateEvent.info !== NATIVE_INDICATOR_INFO || !navigateEvent.canIntercept) return;
			navigateEvent.intercept({ handler: () => hold, focusReset: 'manual', scroll: 'manual' });
		});

		// replacing the iframe's entry with its current URL does not change anything
		frameNavigation
			.navigate(frameWindow.location.href, { history: 'replace', info: NATIVE_INDICATOR_INFO })
			.finished.catch(() => {});
	}

	function stopNativeIndicator() {
		if (!nativeIndicator) return;
		const { frame, release } = nativeIndicator;
		nativeIndicator = undefined;
		release();
		frame.remove();
	}

	/**
	 * Keys that SvelteKit's router stores in `history.state`. They let it recognize a history
	 * entry as its own, so going forward to the placeholder entry below runs a normal navigation.
	 */
	const HISTORY_INDEX = 'sveltekit:history';
	const NAVIGATION_INDEX = 'sveltekit:navigation';

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
		const state = history.state ?? {};
		const placeholderState = {
			[HISTORY_INDEX]: (state[HISTORY_INDEX] ?? 0) + 1,
			[NAVIGATION_INDEX]: (state[NAVIGATION_INDEX] ?? 0) + 1
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
				clearTimeout(timeout);
				removeEventListener('popstate', done);
				resolve();
			};
			const timeout = setTimeout(done, 500);
			addEventListener('popstate', done, { once: true });
			history.back();
		});
	}

	async function navigateToStory(target: URL) {
		if (pending) replacePlaceholderEntry(target);
		else pushPlaceholderEntry(target);
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
			if (to) disposeStaleStories(to.url.pathname);
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
			startNativeIndicator();
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
		background-color: light-dark(#4868a9, #c5dbff);
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
