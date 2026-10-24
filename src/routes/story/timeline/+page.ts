import { loadStory } from '$lib/components';

export const load = async ({ url }) => ({
	story: await loadStory('5f9c9e9e40494b0c81041ffed5927214', url)
});
