import type { Picture } from '@sveltejs/enhanced-img';
import data from './stories.json';

export interface Story {
	/** The path of the story's page, such as `/story/pollution`. */
	href: string;
	label: string;
	description: string;
	/**
	 * The file name of the story's cover image in this folder, such as `pollution.webp`.
	 * No image is shown when it is omitted or the file does not exist.
	 */
	image?: string;
}

/** The images in this folder, keyed by file name. */
const images = Object.fromEntries(
	Object.entries(
		import.meta.glob<Picture>('./*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}', {
			eager: true,
			query: { enhanced: true },
			import: 'default'
		})
	).map(([path, picture]) => [path.slice(2), picture])
);

/** The StoryMaps stories in this project */
export const stories = (data as Story[]).map((story) => ({
	...story,
	picture: story.image ? images[story.image] : undefined
}));
