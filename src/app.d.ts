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
	}

	interface Window {
		storyMapsEmbedConfig?: StoryMaps.StoryMapsEmbedConfig;
	}
}

export {};
