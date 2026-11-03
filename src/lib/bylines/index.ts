import type { Picture } from '@sveltejs/enhanced-img';

/** The author of a story or video. */
export interface Byline {
	name: string;
	/** When it is set, the name links to this URL, such as the author's profile page. */
	url?: string;
	/** Shown below the name, such as the author's department or organization. */
	title: string;
	/**
	 * The file name of the author's photo or logo in this folder or in `$lib/contributors`.
	 *
	 * No photo is shown when it is omitted or the file does not exist.
	 */
	photo?: string;
	/** A version of `photo` to use in dark mode. */
	photo_dark?: string;
	/** Whether to outline the photo. Defaults to `true`. */
	photo_border?: boolean;
}

/**
 * A photo of a byline, which is a URL for SVGs (since they cannot be enhanced).
 */
export type BylinePhoto = Picture | string;

/**
 * The photos in this folder and in `$lib/contributors`, keyed by file name.
 *
 * This allows us to just write the photo name in the byline config,
 * and then `resolveByline()` can resolve the photo name to an actual path.
 */
const photos = Object.fromEntries(
	[
		...Object.entries(
			import.meta.glob<Picture>(
				[
					'./*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}',
					'../contributors/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}'
				],
				{ eager: true, query: { enhanced: true }, import: 'default' }
			)
		),
		...Object.entries(
			import.meta.glob<string>('./*.svg', { eager: true, query: '?url', import: 'default' })
		)
	].map(([path, photo]): [string, BylinePhoto] => [path.split('/').at(-1)!, photo])
);

/**
 * Resolves the photo names in a byline to actual photo paths.
 */
export function resolveByline(byline: Byline) {
	return {
		...byline,
		picture: byline.photo ? photos[byline.photo] : undefined,
		pictureDark: byline.photo_dark ? photos[byline.photo_dark] : undefined
	};
}

export type ResolvedByline = ReturnType<typeof resolveByline>;
