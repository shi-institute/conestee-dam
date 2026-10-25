import { resolve } from '$app/paths';
import { openGlossaryTerm } from './dialog.svelte';
import type { Glossary } from './types';

/**
 * Text inside these elements is never linked, since it is already interactive,
 * is not prose, or is hidden from assistive technology.
 */
const EXCLUDED_SELECTOR = [
	'a',
	'button',
	'summary',
	'label',
	'select',
	'option',
	'input',
	'textarea',
	'script',
	'style',
	'noscript',
	'code',
	'pre',
	'svg',
	'[contenteditable]:not([contenteditable="false"])',
	'[role="button"]',
	'[role="link"]',
	'[role="tab"]',
	'[role="menuitem"]',
	'[role="option"]',
	'[role="switch"]',
	'[role="checkbox"]',
	'[role="radio"]',
	'[aria-hidden="true"]',
	'[data-glossary-ignore]'
].join(', ');

/**
 * Builds one regular expression that matches every term, with one capture group per
 * pattern. Longer patterns come first so that the longest matching term wins.
 */
function createMatcher(glossary: Glossary) {
	const patterns = glossary.entries
		.flatMap((entry) => entry.patterns.map((pattern) => ({ pattern, id: entry.id })))
		.sort((a, b) => b.pattern.length - a.pattern.length);
	const alternatives = patterns.map(({ pattern }) => `(${pattern})`).join('|');
	return {
		// terms must start and end at word boundaries (which `\b` does not handle for unicode)
		regex: new RegExp(`(?<![\\p{L}\\p{N}])(?:${alternatives})(?![\\p{L}\\p{N}])`, 'giu'),
		idForMatch: (match: RegExpExecArray) => patterns[match.slice(1).findIndex(Boolean)].id
	};
}

/**
 * Converts glossary terms in the text of `root` into links that open the glossary
 * popup to that term. Matching is case-insensitive, and text that is already in a link,
 * button, or other control is left alone.
 *
 * Content added to `root` later (such as story blocks that StoryMaps renders as the
 * reader scrolls, or components mounted into the story) is also linked.
 *
 * @returns a function that stops linking content that is added later
 */
export function linkGlossaryTerms(root: HTMLElement, glossary: Glossary) {
	const { regex, idForMatch } = createMatcher(glossary);

	/** The nodes this function inserted, so that the observer can ignore them. */
	const insertedNodes = new WeakSet<Node>();

	function createLink(text: string, id: string) {
		const link = document.createElement('a');
		link.href = resolve(`/glossary/#${id}`);
		link.className = 'glossary-term';
		link.dataset.glossaryTerm = id;
		link.textContent = text;

		// open the popup instead of navigating, unless the reader wants a new tab or window
		// (the story's own click handlers would otherwise run first)
		link.addEventListener('click', (event) => {
			const isModified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
			if (event.button !== 0 || isModified) return;
			event.preventDefault();
			event.stopPropagation();
			openGlossaryTerm(glossary, id);
		});

		insertedNodes.add(link);
		return link;
	}

	function linkTextNode(node: Text) {
		const text = node.nodeValue ?? '';
		if (!text.trim() || insertedNodes.has(node)) return;
		if (!node.parentElement || node.parentElement.closest(EXCLUDED_SELECTOR)) return;

		const matches = [...text.matchAll(regex)];
		if (matches.length === 0) return;

		// StoryMaps (React) and Svelte keep references to the text nodes they render,
		// so the original node stays in place and holds the text before the first term
		const pieces: Node[] = [];
		let end = matches[0].index;
		for (const match of matches) {
			if (match.index > end) pieces.push(document.createTextNode(text.slice(end, match.index)));
			pieces.push(createLink(match[0], idForMatch(match)));
			end = match.index + match[0].length;
		}
		if (end < text.length) pieces.push(document.createTextNode(text.slice(end)));

		for (const piece of pieces) insertedNodes.add(piece);
		node.nodeValue = text.slice(0, matches[0].index);
		node.after(...pieces);
	}

	function linkNode(node: Node) {
		if (insertedNodes.has(node)) return;
		if (node instanceof Text) {
			linkTextNode(node);
			return;
		}
		if (!(node instanceof Element)) return;

		// collect the text nodes first, since linking them changes the tree being walked
		const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
		const textNodes: Text[] = [];
		while (walker.nextNode()) textNodes.push(walker.currentNode as Text);
		for (const textNode of textNodes) linkTextNode(textNode);
	}

	linkNode(root);

	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (node.isConnected) linkNode(node);
			}
		}
	});
	observer.observe(root, { childList: true, subtree: true });

	return () => observer.disconnect();
}
