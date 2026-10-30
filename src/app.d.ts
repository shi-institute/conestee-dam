// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	namespace StoryMaps {
		type StoryId = string;

		/** CSS selector */
		type RootNode = string;

		type EmbedFont = {
			fontFamily: string;
			weight: {
				normal: number;
				bold: number;
			};
		};

		interface StoryMapsEmbedConfig {
			storyId: StoryId;
			rootNode: RootNode;
			/** number is treated as px */
			topOffset?: `${string}${'rem' | 'px'}` | number;
			font?: {
				title?: EmbedFont;
				body?: EmbedFont;
			};
		}

		interface StoryHeaderMetadata {
			title: string;
			snippet: string;
			/** The story's cover image or `null` if the cover has no image. */
			image: {
				href: string;
				/** The width of the original image in pixels, if StoryMaps knows it. */
				width: number | null;
				alt: string;
				/** HTML. May contain links. */
				attribution: string | null;
			} | null;
			/**
			 * The headings in the story, in order. `id` is the ID of the element in the story
			 * that wraps the heading (StoryMaps links to it as `#ref-<id>`).
			 */
			headings: { id: string; text: string; level: number }[];
		}
	}

	interface Window {
		storyMapsEmbedConfig?: StoryMaps.StoryMapsEmbedConfig;
	}
}

export {};
