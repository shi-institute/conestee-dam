import { stories } from '$lib/stories';
import type { Picture } from '@sveltejs/enhanced-img';
import data from './videos.json';

export interface Video {
	/** The numeric id of the video, which may be used in its URL. */
	id: number;
	/**
	 * Text aliases for the video that are accepted in its URL. The first is the one used in
	 * links, and the others redirect to it.
	 */
	codes: string[];
	/** The id of the video on YouTube (from `youtube.com/watch?v=<id>`). */
	youtube_id: string;
	title: string;
	/** Shown below the title. */
	title_caption: string;
	/** Used for the page's document title instead of `title`. */
	document_title?: string;
	/** Used for the page's meta description. */
	document_description?: string;
	/** The id of the StoryMaps story that is shown as the video's description. */
	storymap_id: string;
	/** The path of the page to watch or read after this video, such as `/story/pollution`. */
	next_episode_path: string | null;
	next_episode_type: 'video' | 'story' | null;
}

/** A video or story that can be listed beside a video. */
export interface Episode {
	type: 'video' | 'story';
	/** The path of the episode's page, which must be passed to `resolve()` before linking to it. */
	path: string;
	label: string;
	description: string;
	/** The id of the video on YouTube, for its thumbnail. */
	youtubeId?: string;
	/** The story's cover image, for its thumbnail. */
	picture?: Picture;
}

export const videos = data as Video[];

export function normalizePath(path: string) {
	return path.replace(/\/+$/, '') || '/';
}

/** Finds a video by its id or any of its codes. */
export function findVideo(idOrCode: string) {
	return videos.find((video) => video.codes.includes(idOrCode) || String(video.id) === idOrCode);
}

/** The code used in links to the video, or its id if it has no codes. */
export function getPreferredCode(video: Video) {
	return video.codes[0] ?? String(video.id);
}

/** Describes the episode that comes after `video`, or returns `null` if there is none. */
export function getNextEpisode(video: Video): Episode | null {
	const { next_episode_path: path, next_episode_type: type } = video;
	if (!path || !type) return null;

	if (type === 'video') {
		const next = findVideo(normalizePath(path).split('/').at(-1) ?? '');
		if (!next) return null;
		return {
			type,
			path: `/video/${getPreferredCode(next)}`,
			label: next.title,
			description: next.title_caption,
			youtubeId: next.youtube_id
		};
	}

	const story = stories.find((story) => story.href === normalizePath(path));
	if (!story) return null;
	return {
		type,
		path: story.href,
		label: story.label,
		description: story.description,
		picture: story.picture
	};
}

/** Lists every story in the project as an episode. */
export function getStoryEpisodes(): Episode[] {
	return stories.map((story) => ({
		type: 'story',
		path: story.href,
		label: story.label,
		description: story.description,
		picture: story.picture
	}));
}
