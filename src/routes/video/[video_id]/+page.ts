import { loadStory } from '$lib/components';
import { findVideo, getPreferredCode, videos } from '$lib/videos';
import { error, redirect } from '@sveltejs/kit';
import type { EntryGenerator } from './$types';

// prerender each video at each of its codes and at its id (all but the preferred code redirect)
export const entries: EntryGenerator = () =>
	videos.flatMap((video) => [...video.codes, String(video.id)].map((video_id) => ({ video_id })));

export const load = async ({ params, url }) => {
	const video = findVideo(params.video_id);
	if (!video) error(404, 'Video not found');

	// the first code is preferred in the URL
	const preferredCode = getPreferredCode(video);
	if (params.video_id !== preferredCode) {
		redirect(308, url.pathname.replace(/[^/]+\/?$/, `${preferredCode}/`));
	}

	return {
		video,
		// the video is the main content, so we can allow
		// the description to load after the page is shwon
		story: await loadStory(video.storymap_id, url, { wait: false })
	};
};
