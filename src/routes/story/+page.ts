import { loadStory } from '$lib/components';
import { browser } from '$app/env';
import { redirect } from '@sveltejs/kit';

export const load = async ({ url }) => {
	// redirect to the first video
	const firstVideo = (await import('$lib/videos/videos.json')).default.find(
		(video) => video.id === 1
	);
	const redirectTo = `/video/${firstVideo?.codes[0] || firstVideo?.id || 1}`;

	// client-side navigations already replace the history entry when redirected,
	// but a prerendered redirect uses `location.href`, which adds a history entry,
	// so we instead render a page that uses `location.replace` during prerendering
	if (browser) redirect(307, redirectTo);
	return { redirectTo };

	return {
		story: await loadStory('b3daea8f94a14558b386108914d9d3b9', url)
	};
};
