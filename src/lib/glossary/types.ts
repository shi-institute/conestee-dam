export interface GlossaryEntry {
	/** The anchor id for the term, so other pages can link to `/glossary/#id`. */
	id: string;
	/** The term, rendered as inline HTML. */
	termHtml: string;
	/** The term as plain text. */
	termText: string;
	/** The definition, rendered as HTML. */
	definitionHtml: string;
	/** The term and definition as plain text, lowercased, for searching. */
	searchText: string;
	/**
	 * Regular expression sources (for the `iu` flags) that match the term in running text.
	 * Story text that matches one of these is linked to the term.
	 */
	patterns: string[];
}

export interface Glossary {
	/** The introduction from above the first term, rendered as HTML. */
	introHtml: string;
	/** The terms, sorted alphabetically. */
	entries: GlossaryEntry[];
}

/** Groups entries (which must already be sorted) under the first letter or digit of each term. */
export function groupByLetter(entries: GlossaryEntry[]) {
	const groups: { letter: string; entries: GlossaryEntry[] }[] = [];
	for (const entry of entries) {
		const letter = entry.searchText.match(/[a-z0-9]/)?.[0].toUpperCase() ?? '#';
		const last = groups.at(-1);
		if (last?.letter === letter) last.entries.push(entry);
		else groups.push({ letter, entries: [entry] });
	}
	return groups;
}
