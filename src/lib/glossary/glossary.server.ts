import { Marked, type Tokens, type TokensList } from 'marked';
import source from './glossary.md?raw';
import type { Glossary, GlossaryEntry } from './types';

// external links in definitions open in a new tab so readers do not lose their place
const marked = new Marked({
	renderer: {
		link({ href, title, tokens }) {
			const text = this.parser.parseInline(tokens);
			const titleAttr = title ? ` title="${title}"` : '';
			const isExternal = /^https?:\/\//.test(href);
			const targetAttrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
			return `<a href="${href}"${titleAttr}${targetAttrs}>${text}</a>`;
		}
	}
});

function slugify(text: string) {
	return text
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[’']/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function stripTags(html: string) {
	return html
		.replace(/<[^>]*>/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&[a-z#0-9]+;/gi, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

/** Renders a group of block tokens, keeping the link definitions from the whole document. */
function renderTokens(tokens: Tokens.Generic[], links: TokensList['links']) {
	return marked.parser(Object.assign(tokens, { links }) as TokensList);
}

/**
 * Converts a phrase into a regular expression source that matches it in running text.
 *
 * Words may be separated by any spaces or hyphens ("endocrine disrupting" matches
 * "Endocrine-Disrupting"), either apostrophe may be used, and the last word may be
 * singular or plural ("wetland" matches "Wetlands").
 */
function toPattern(phrase: string) {
	const words = phrase.split(/[-\s]+/).filter(Boolean);
	return words
		.map((word, index) => {
			const isLast = index === words.length - 1;
			// a lowercase plural "s" is optional ("PCBs"), but an "S" in an acronym like PFAS is not
			const stem = isLast && /\p{L}s$/u.test(word) && !/ss$/i.test(word) ? word.slice(0, -1) : word;
			const escaped = stem.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&').replace(/['’]/g, "['’]");
			return isLast && /\p{L}$/u.test(stem) ? `${escaped}(?:s|es)?` : escaped;
		})
		.join('[-\\s]+');
}

/**
 * The phrases that story text is matched against for a term: the term without any
 * parenthetical ("Heavy Metals"), any acronym in parentheses ("PFAS"), and any
 * other names listed for the term in its heading.
 */
function toPatterns(term: string, otherNames: string[]) {
	const phrases = new Set<string>(otherNames);
	const withoutParentheticals = term.replace(/\s*\([^)]*\)/g, '').trim();
	if (withoutParentheticals) phrases.add(withoutParentheticals);
	for (const [, inner] of term.matchAll(/\(([^)]*)\)/g)) {
		if (/^[A-Z]{2,}s?$/.test(inner)) phrases.add(inner);
	}
	return [...phrases].map(toPattern);
}

/**
 * Splits the glossary Markdown into an introduction (everything before the
 * first `##` heading) and one entry per `##` heading.
 */
function parseGlossary(markdown: string): Glossary {
	const tokens = marked.lexer(markdown);

	const introTokens: Tokens.Generic[] = [];
	const groups: { heading: Tokens.Heading; body: Tokens.Generic[] }[] = [];

	for (const token of tokens) {
		// editor notes in HTML comments are not shown on the page
		if (token.type === 'html' && token.raw.trim().startsWith('<!--')) continue;

		if (token.type === 'heading' && token.depth === 2) {
			groups.push({ heading: token as Tokens.Heading, body: [] });
		} else if (groups.length > 0) {
			groups[groups.length - 1].body.push(token);
		} else {
			introTokens.push(token);
		}
	}

	const usedIds = new Set<string>();
	const entries: GlossaryEntry[] = groups.map(({ heading, body }) => {
		// a heading may end with {#custom-id also="Other name; Another name"}, in any order
		const attributes = heading.text.match(/\s*\{([^{}]*)\}\s*$/);
		const term = attributes ? heading.text.slice(0, attributes.index) : heading.text;
		const customId = attributes?.[1].match(/(?:^|\s)#([a-z0-9-]+)/i)?.[1];
		const otherNames = (attributes?.[1].match(/also\s*=\s*"([^"]*)"/)?.[1] ?? '')
			.split(';')
			.map((name) => name.trim())
			.filter(Boolean);
		const baseId = customId ?? slugify(term);

		let id = baseId;
		for (let n = 2; usedIds.has(id); n++) id = `${baseId}-${n}`;
		usedIds.add(id);

		const termHtml = marked.parseInline(term, { async: false });
		const termText = stripTags(termHtml);
		const definitionHtml = renderTokens(body, tokens.links);
		const searchText = `${termText} ${stripTags(definitionHtml)}`.toLowerCase();

		return {
			id,
			termHtml,
			termText,
			definitionHtml,
			searchText,
			patterns: toPatterns(termText, otherNames)
		};
	});

	// sort by the term's text, ignoring leading punctuation and letter case
	const sortKey = (entry: GlossaryEntry) => entry.termText.replace(/^[^a-z0-9]+/i, '');
	entries.sort((a, b) =>
		sortKey(a).localeCompare(sortKey(b), 'en', { sensitivity: 'base', numeric: true })
	);

	return {
		introHtml: renderTokens(introTokens, tokens.links),
		entries
	};
}

export const glossary = parseGlossary(source);
