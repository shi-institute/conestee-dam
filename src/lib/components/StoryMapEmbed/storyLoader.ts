import { browser } from '$app/env';

/**
 * A StoryMap that loads into an off-screen host element.
 *
 * Nothing is injected into the page until `start()` is called, and a story is only started
 * while the URL matches its route. The host is moved into the page by `StoryMapEmbed`
 * once the page is shown.
 */
export interface StoryLoad {
	/** The ID of the story in StoryMaps. */
	storyId: string;

	/** The element that StoryMaps renders the story into. */
	host: HTMLDivElement;

	/** The pathname of the page that shows this story. */
	pathname: string;

	/** Whether the story has been moved into the page. */
	adopted: boolean;

	/** The story article, or `null` if the story has not finished loading yet. */
	article: HTMLElement | null;

	/**
	 * Resolves with the story article when the story has loaded.
	 *
	 * Since StoryMaps does not provide a callback for when the story has loaded,
	 * we watch for an `article.story` with a `.sc-title` to estimate that the story has loaded.
	 * It resolves with `null` if the story fails to load or is disposed.
	 */
	ready: Promise<HTMLElement | null>;

	/**
	 * Resolves with the story's title, snippet, cover image, and headings from `getStoryMetadata()`,
	 * which are available long before the story itself has loaded.
	 */
	metadata: Promise<StoryMaps.StoryHeaderMetadata | null>;

	/** Starts loading the story (it is queued behind any other story that is loading). */
	start: () => void;

	/** Removes the story from the document and releases its resources. */
	dispose: () => void;
}

/** How long a navigation waits for a story's metadata before showing the page anyway. */
const NAVIGATION_WAIT_MS = 5_000;

/** How long a story may take before the next story is allowed to start loading. */
const QUEUE_RELEASE_MS = 30_000;

const loads = new Map<string, StoryLoad>();

/**
 * StoryMaps reads its configuration from a global and a script tag, so only one
 * story can be started at a time.
 */
let queue: Promise<unknown> = Promise.resolve();

let stagingElement: HTMLDivElement | null = null;

/** The pathname of the page that was most recently asked for. */
let wantedPathname: string | null = null;

/**
 * Whether the app has hydrated. Until then, loading a story must not block,
 * or hydration of a directly-visited story page would wait for the story.
 */
let hydrated = false;

export function markHydrated() {
	hydrated = true;
}

function normalizePathname(pathname: string) {
	return pathname.replace(/\/+$/, '') || '/';
}

/**
 * An invisible, viewport-sized container where stories load before the user
 * navigates to them. It is rendered (not `display: none`) so that the story lays out.
 */
function getStagingElement() {
	if (!stagingElement) {
		stagingElement = document.createElement('div');
		stagingElement.setAttribute('aria-hidden', 'true');
		stagingElement.inert = true;
		stagingElement.style.cssText =
			'position: fixed; top: 0; left: 0; width: 100vw; height: 100dvh; overflow: hidden; visibility: hidden; pointer-events: none; z-index: -1;';
		document.body.appendChild(stagingElement);
	}
	return stagingElement;
}

function createStoryLoad(storyId: string, pathname: string): StoryLoad {
	const host = document.createElement('div');
	const rootClass = `storymaps-root-${Math.random().toString(36).slice(2)}`;
	host.classList.add('storymap-embed', rootClass);

	const script = document.createElement('script');
	script.src = 'https://storymaps.arcgis.com/embed/view';
	script.type = 'text/javascript';
	script.async = true;

	const config: StoryMaps.StoryMapsEmbedConfig = {
		storyId,
		rootNode: `.${rootClass}`,
		// StoryMaps sizes, sticks, and scrolls immersive blocks below this offset
		topOffset:
			(getComputedStyle(document.body)
				.getPropertyValue('--header-height')
				.trim() as `${string}px`) || ('3rem' as `${string}rem`),
		font: {
			body: {
				fontFamily: 'greycliff-cf',
				weight: { normal: 400, bold: 700 }
			},
			title: {
				fontFamily: 'greycliff-cf',
				weight: { normal: 600, bold: 600 }
			}
		}
	};

	let started = false;
	let disposed = false;
	let observer: MutationObserver | null = null;
	let headObserver: MutationObserver | null = null;
	let releaseQueue: (() => void) | null = null;
	let resolveReady!: (article: HTMLElement | null) => void;
	/** Styles and scripts that StoryMaps added to the head while this story loaded. */
	const injectedNodes: Node[] = [];

	const load: StoryLoad = {
		storyId,
		host,
		pathname,
		adopted: false,
		article: null,
		ready: new Promise<HTMLElement | null>((resolve) => (resolveReady = resolve)),
		metadata: getStoryMetadata(storyId),
		start() {
			if (started || disposed) return;
			started = true;

			queue = queue.then(
				() =>
					new Promise<void>((release) => {
						releaseQueue = release;
						if (disposed) {
							release();
							return;
						}

						const releaseTimeout = setTimeout(release, QUEUE_RELEASE_MS);
						const finish = (article: HTMLElement | null) => {
							observer?.disconnect();
							headObserver?.disconnect();
							clearTimeout(releaseTimeout);
							load.article = article;
							resolveReady(article);
							release();
						};

						observer = new MutationObserver(() => {
							const article = host.querySelector<HTMLElement>('article.story');
							if (article?.querySelector('.sc-title')) {
								finish(article);
							}
						});

						// a story that was already moved into the page loads where it is
						if (!host.isConnected) getStagingElement().appendChild(host);
						observer.observe(host, { childList: true, subtree: true });

						// remember what StoryMaps adds to the head so that it can be removed
						// if this story is abandoned before the user gets to see it
						headObserver = new MutationObserver((mutations) => {
							for (const mutation of mutations) {
								for (const node of mutation.addedNodes) {
									if (node !== script) injectedNodes.push(node);
								}
							}
						});
						headObserver.observe(document.head, { childList: true });

						script.addEventListener('error', () => finish(null));
						window.storyMapsEmbedConfig = config;
						document.head.appendChild(script);
					})
			);
		},
		dispose() {
			const abandoned = !load.adopted && !load.article;
			disposed = true;
			observer?.disconnect();
			headObserver?.disconnect();
			host.remove();
			script.remove();
			if (abandoned) {
				for (const node of injectedNodes) {
					if (node instanceof Element) node.remove();
				}
			}
			if (window.storyMapsEmbedConfig === config) delete window.storyMapsEmbedConfig;
			if (loads.get(storyId) === load) loads.delete(storyId);
			resolveReady(null);
			releaseQueue?.();
		}
	};

	return load;
}

/**
 * Disposes of stories that were loading for a page the user is no longer going to,
 * so that they do not pile up in the background (for example, when quickly clicking
 * several links).
 */
export function disposeStaleStories(currentPathname: string | null = wantedPathname) {
	if (!browser || currentPathname === null) return;
	wantedPathname = currentPathname;
	for (const load of [...loads.values()]) {
		if (!load.adopted && normalizePathname(load.pathname) !== normalizePathname(currentPathname)) {
			load.dispose();
		}
	}
}

/**
 * Prepares a story for the page at `url` and returns it. On the server, it returns `null`.
 *
 * The story only starts loading while the browser's URL is that of the page. During client-side
 * navigation, the returned promise then resolves once the story's metadata (its title, snippet,
 * and cover image) has loaded (or after a timeout), so SvelteKit keeps the current page visible
 * until the page can show the story's heading. The story itself keeps loading in the page.
 * During the initial page load, it does not wait. If the URL does not match, the story is started later,
 * when the page adopts it.
 *
 * Pass `{ wait: false }` to show the page right away and let the story load in place
 * (such as when the story is not the main content of the page).
 *
 * @example
 * ```ts
 * // +page.ts
 * export const load = async ({ url }) => ({
 * 	story: await loadStory('b3daea8f94a14558b386108914d9d3b9', url)
 * });
 * ```
 */
export async function loadStory(
	storyId: string,
	url: URL,
	{ wait = true }: { wait?: boolean } = {}
): Promise<StoryLoad | null> {
	if (!browser) return null;

	disposeStaleStories(url.pathname);

	let load = loads.get(storyId);
	if (!load) {
		load = createStoryLoad(storyId, url.pathname);
		loads.set(storyId, load);
	}

	const matchesUrl = normalizePathname(location.pathname) === normalizePathname(url.pathname);
	if (matchesUrl) {
		load.start();
		if (hydrated && wait) {
			await Promise.race([
				load.metadata,
				new Promise((resolve) => setTimeout(resolve, NAVIGATION_WAIT_MS))
			]);
		}
	}

	return load;
}

interface StoryNode {
	type: string;
	data?: {
		image?: string;
		attribution?: string;
		alt?: string;
		type?: string;
		text?: string;
		title?: string;
		summary?: string;
	};
	children?: string[];
}

interface StoryData {
	config?: { PORTAL_HOST?: string };
	publishedData: {
		root: string;
		nodes: Record<string, StoryNode>;
		resources: Record<
			string,
			{ type: string; data?: { resourceId?: string; width?: number; height?: number } }
		>;
	};
}

const HTML_ENTITIES: Record<string, string> = {
	amp: '&',
	lt: '<',
	gt: '>',
	quot: '"',
	apos: "'",
	nbsp: '\u00a0'
};

/** Converts the HTML of a StoryMaps text block to plain text. */
function htmlToText(html: string) {
	return html
		.replace(/<[^>]*>/g, '')
		.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (entity, name: string) => {
			if (name[0] !== '#') return HTML_ENTITIES[name.toLowerCase()] ?? entity;
			const code =
				name[1].toLowerCase() === 'x' ? parseInt(name.slice(2), 16) : Number(name.slice(1));
			return String.fromCodePoint(code);
		})
		.replace(/\s+/g, ' ')
		.trim();
}

/** Lists the headings in the story, in the order they appear in the story. */
function collectHeadings(
	nodes: Record<string, StoryNode>,
	id: string,
	headings: StoryMaps.StoryHeaderMetadata['headings'] = []
) {
	const node = nodes[id];
	const level = node?.type === 'text' && node.data?.type?.match(/^h([1-6])$/)?.[1];
	const text = level && node.data?.text ? htmlToText(node.data.text) : '';
	// StoryMaps gives the element that wraps each block the ID of its node
	if (text) headings.push({ id, text, level: Number(level) });
	for (const child of node?.children ?? []) collectHeadings(nodes, child, headings);
	return headings;
}

const metadataRequests = new Map<string, Promise<StoryMaps.StoryHeaderMetadata | null>>();

/**
 * Gets the title, snippet, cover image, and headings of a story without loading the story itself.
 *
 * The title and snippet are the title and summary shown on the story cover (not those of
 * the story's item, which may differ).
 * `image` is `null` if the story cover has no image. It resolves with `null` if the story
 * data could not be fetched. Successful requests are remembered, so asking for the
 * same story again resolves right away.
 *
 * StoryMaps rejects requests without an `Origin` header, so this should be called in the browser.
 *
 * @example
 * ```ts
 * const metadata = await getStoryMetadata('b3daea8f94a14558b386108914d9d3b9');
 * ```
 */
export function getStoryMetadata(
	storyId: string,
	fetch = globalThis.fetch
): Promise<StoryMaps.StoryHeaderMetadata | null> {
	let request = metadataRequests.get(storyId);
	if (!request) {
		request = fetchStoryMetadata(storyId, fetch);
		metadataRequests.set(storyId, request);
		// try again next time if it failed
		request.then((metadata) => {
			if (!metadata) metadataRequests.delete(storyId);
		});
	}
	return request;
}

async function fetchStoryMetadata(
	storyId: string,
	fetch: typeof globalThis.fetch
): Promise<StoryMaps.StoryHeaderMetadata | null> {
	let data: StoryData;
	try {
		const response = await fetch(`https://storymaps.arcgis.com/embed/view/${storyId}/data`);
		if (!response.ok) return null;
		data = await response.json();
	} catch {
		return null;
	}

	const { root, nodes, resources } = data.publishedData;

	// the cover image is the child of the storycover node
	const cover = Object.values(nodes).find((node) => node.type === 'storycover');
	const imageNode = cover?.children?.map((id) => nodes[id]).find((node) => node?.type === 'image');
	const resource = imageNode?.data?.image ? resources[imageNode.data.image]?.data : undefined;

	const portalHost = data.config?.PORTAL_HOST ?? 'www.arcgis.com';
	const image = resource?.resourceId
		? {
				href: `https://${portalHost}/sharing/rest/content/items/${storyId}/resources/${resource.resourceId}`,
				width: resource.width ?? null,
				alt: imageNode?.data?.alt ?? '',
				attribution: imageNode?.data?.attribution || null
			}
		: null;

	return {
		title: htmlToText(cover?.data?.title ?? ''),
		snippet: htmlToText(cover?.data?.summary ?? ''),
		image,
		headings: collectHeadings(nodes, root)
	};
}
