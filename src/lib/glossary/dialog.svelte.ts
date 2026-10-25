import { resolve } from '$app/paths';
import type { Glossary } from './types';

/** The state of the glossary popup, which is shown by `GlossaryDialog` in the root layout. */
export const glossaryDialog = $state<{
	open: boolean;
	/** The id of the term to scroll to and highlight. */
	termId: string;
	glossary: Glossary | null;
}>({ open: false, termId: '', glossary: null });

/** Opens the glossary popup, scrolled to the term with the given id. */
export function openGlossaryTerm(glossary: Glossary, termId: string) {
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
