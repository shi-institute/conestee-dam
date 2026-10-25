import { resolve } from '$app/paths';
import type { Glossary } from './types';

/** The state of the glossary popup, which is shown by `GlossaryDialog` in the root layout. */
export const glossaryDialog = $state<{
	open: boolean;
	/** The id of the term to scroll to and highlight. */
	termId: string;
	glossary: Glossary | null;
}>({ open: false, termId: '', glossary: null });

/** Shows a term in the glossary that is pinned to the page, if there is one. */
let showPinnedTerm: ((termId: string) => void) | null = null;

/**
 * Shows terms in a glossary that is pinned to the page (such as the sidebar on video pages)
 * instead of in the popup, until the returned function is called.
 */
export function pinGlossary(showTerm: (termId: string) => void) {
	showPinnedTerm = showTerm;
	return () => {
		if (showPinnedTerm === showTerm) showPinnedTerm = null;
	};
}

/** Opens the glossary popup (or the pinned glossary), scrolled to the term with the given id. */
export function openGlossaryTerm(glossary: Glossary, termId: string) {
	if (showPinnedTerm) {
		showPinnedTerm(termId);
		return;
	}
	glossaryDialog.glossary = glossary;
	glossaryDialog.termId = termId;
	glossaryDialog.open = true;
}

let glossaryRequest: Promise<Glossary> | null = null;

/** Fetches the glossary (prerendered by `/glossary.json`) once, and reuses it after that. */
export function fetchGlossary() {
	glossaryRequest ??= fetch(resolve('/glossary.json'))
		.then((response) => {
			if (!response.ok) throw new Error(`Failed to fetch the glossary (${response.status})`);
			return response.json() as Promise<Glossary>;
		})
		.catch((error) => {
			// allow a later story to try again
			glossaryRequest = null;
			throw error;
		});
	return glossaryRequest;
}
