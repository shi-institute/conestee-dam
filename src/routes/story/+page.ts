import { loadStory } from '$lib/components';

export const load = async ({ url }) => ({
	story: await loadStory('b3daea8f94a14558b386108914d9d3b9', url)
});
