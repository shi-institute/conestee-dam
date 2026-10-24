import { loadStory } from '$lib/components';

export const load = async ({ url }) => ({
	story: await loadStory('0406f88b70a74be4ac21fd0050fcdd8f', url)
});
