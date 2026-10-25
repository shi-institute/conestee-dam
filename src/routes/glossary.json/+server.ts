import { json } from '@sveltejs/kit';
import { glossary } from '$lib/glossary/glossary.server';

// story pages fetch this file to link glossary terms in their text
export const prerender = true;
export const trailingSlash = 'never';

export const GET = () => json(glossary);
