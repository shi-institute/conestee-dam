import { loadStory } from '$lib/components';

export const load = async ({ url }) => ({
	story: await loadStory('1e96d03d7144440ab8c44a8bb5a4db6b', url)
});
