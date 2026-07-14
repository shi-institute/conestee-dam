<script lang="ts">
	import { StoryMapEmbed } from '$lib/components';
	import { mount } from 'svelte';
	import PollutionTimeline from './PollutionTimeline.svelte';

	function replaceTimelinePlaceholder(article: HTMLElement) {
		const codeBlocks = article.querySelectorAll('div:has(> div > pre > code)');
		const timelineCodeBlock = Array.from(codeBlocks).find((block) => {
			const codeElement = block.querySelector('pre > code');
			return codeElement?.textContent === '{ "type": "mount", "component": "PollutionTimeline" }';
		});

		if (!timelineCodeBlock) {
			console.error('Timeline code block not found in the article.');
			return;
		}

		const target = document.createElement('div');
		target.style.padding = '0 1rem';
		timelineCodeBlock.firstElementChild?.replaceWith(target);
		mount(PollutionTimeline, { target });
	}
</script>

<StoryMapEmbed
	storyId="1dffd70478584a8eb9a42daf25f12f5b"
	loadingHeight="calc(100dvh - var(--header-height))"
	onStoryLoaded={(article) => {
		replaceTimelinePlaceholder(article);
	}}
/>
