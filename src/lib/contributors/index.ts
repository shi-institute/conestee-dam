import type { Picture } from '@sveltejs/enhanced-img';
import data from './contributors.json';

export interface Contributor {
	name: string;
	role: string;
	/**
	 * The file name of the contributor's photo in this folder, such as `jane-doe.jpg`.
	 * A placeholder icon is shown when it is omitted or the file does not exist.
	 */
	photo?: string;
}

/** The photos in this folder, keyed by file name. */
const photos = Object.fromEntries(
	Object.entries(
		import.meta.glob<Picture>('./*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}', {
			eager: true,
			query: { enhanced: true },
			import: 'default'
		})
	).map(([path, picture]) => [path.slice(2), picture])
);

export const contributors = (data as Contributor[]).map((contributor) => ({
	...contributor,
	picture: contributor.photo ? photos[contributor.photo] : undefined
}));
