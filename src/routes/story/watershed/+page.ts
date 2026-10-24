import { loadStory } from '$lib/components';

export const load = async ({ url }) => ({
	story: await loadStory('508e757ef57d4d208cacaff71210796b', url)
});
