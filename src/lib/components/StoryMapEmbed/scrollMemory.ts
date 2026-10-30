/**
 * Remembers where the reader was in a story so that going back (or forward) to the story
 * returns to the same place once the story has loaded again.
 *
 * The position is stored as the story block at the top of the viewport and how far through
 * that block the reader was (as a fraction of its height) so that it still points to the
 * same content if the viewport has been resized.
 */

interface ScrollPosition {
	/** The ID of the story block at the top of the viewport or `null` if it was above the story. */
	blockId: string | null;
	/** How far the top of the viewport was through the block from 0 to 1. */
	fraction: number;
	/** The scroll position in pixels, used when the position was above the story. */
	scrollY: number;
}

const storageKey = (storyId: string) => `story-scroll-position:${storyId}`;

/** The line below the titlebar where content starts to be visible. */
function getTopLine() {
	return parseFloat(getComputedStyle(document.body).getPropertyValue('--header-height')) || 0;
}

/**
 * Gets where an element is laid out relative to the viewport, ignoring transforms that move
 * it from there (such as the story's entrance animation, which would otherwise make the
 * page scroll to where the element is in the middle of animating).
 */
function getLayoutRect(element: Element) {
	const rect = element.getBoundingClientRect();
	let offset = 0;
	for (let current: Element | null = element; current; current = current.parentElement) {
		const transform = getComputedStyle(current).transform;
		if (transform !== 'none') offset += new DOMMatrixReadOnly(transform).m42;
	}
	return { top: rect.top - offset, bottom: rect.bottom - offset, height: rect.height };
}

/**
 * Scrolls an element to the top of the viewport (below its `scroll-margin-top`) right away,
 * even while it is animating into place.
 */
export function scrollToElement(element: Element) {
	const margin = parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
	window.scrollTo({
		top: window.scrollY + getLayoutRect(element).top - margin,
		behavior: 'instant'
	});
}

/** Finds the innermost story block that crosses the line below the titlebar. */
function findBlockAtTop(article: HTMLElement) {
	const line = getTopLine();
	let found: { element: HTMLElement; rect: ReturnType<typeof getLayoutRect> } | null = null;
	// blocks are listed in document order, so the last one that crosses the line is the innermost
	for (const element of article.querySelectorAll<HTMLElement>('[id^="n-"]')) {
		const rect = getLayoutRect(element);
		if (rect.height > 0 && rect.top <= line && rect.bottom > line) found = { element, rect };
	}
	return found;
}

export function saveScrollPosition(storyId: string, article: HTMLElement) {
	const block = findBlockAtTop(article);
	const position: ScrollPosition = {
		blockId: block?.element.id ?? null,
		fraction: block ? (getTopLine() - block.rect.top) / block.rect.height : 0,
		scrollY: window.scrollY
	};
	try {
		localStorage.setItem(storageKey(storyId), JSON.stringify(position));
	} catch {
		// the position just will not be remembered
	}
}

function readScrollPosition(storyId: string): ScrollPosition | null {
	try {
		const position = JSON.parse(localStorage.getItem(storageKey(storyId)) ?? 'null');
		return position && typeof position.scrollY === 'number' ? position : null;
	} catch {
		return null;
	}
}

/** Whether there is a remembered position in a story to return to (other than its top). */
export function hasScrollPosition(storyId: string) {
	const position = readScrollPosition(storyId);
	return !!position && (position.blockId !== null || position.scrollY > 0);
}

/**
 * Scrolls to the remembered position in a story.
 *
 * It scrolls again as the story settles (such as when its images load and push the block
 * down), unless the reader scrolls first. Returns `false` if no position was remembered.
 */
export function restoreScrollPosition(storyId: string, article: HTMLElement) {
	const position = readScrollPosition(storyId);
	if (!position) return false;

	const scroll = () => {
		const block = position.blockId ? document.getElementById(position.blockId) : null;
		if (block && article.contains(block)) {
			const rect = getLayoutRect(block);
			const top = window.scrollY + rect.top + position.fraction * rect.height - getTopLine();
			window.scrollTo({ top, behavior: 'instant' });
		} else {
			window.scrollTo({ top: position.scrollY, behavior: 'instant' });
		}
	};

	// stop once the reader scrolls (or otherwise interacts with the page) themselves
	const inputEvents = ['wheel', 'touchstart', 'keydown', 'mousedown'] as const;
	const timeouts: ReturnType<typeof setTimeout>[] = [];
	const stop = () => {
		for (const timeout of timeouts) clearTimeout(timeout);
		for (const type of inputEvents) window.removeEventListener(type, stop, true);
	};
	for (const type of inputEvents) {
		window.addEventListener(type, stop, { capture: true, passive: true });
	}

	requestAnimationFrame(scroll);
	timeouts.push(setTimeout(scroll, 250), setTimeout(scroll, 1000), setTimeout(stop, 1000));
	return true;
}
