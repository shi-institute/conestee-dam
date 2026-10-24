import { loadStory } from '$lib/components';

export const load = async ({ url }) => ({
	story: await loadStory('1dffd70478584a8eb9a42daf25f12f5b', url)
});
