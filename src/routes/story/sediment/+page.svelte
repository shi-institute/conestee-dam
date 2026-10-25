<script lang="ts">
	import type { PageProps } from './$types';
	import { StoryMapEmbed } from '$lib/components';
	import { mount } from 'svelte';
	import SedimentTimeline from './SedimentTimeline.svelte';

	function replaceTimelinePlaceholder(article: HTMLElement) {
		const codeBlocks = article.querySelectorAll('div:has(> div > pre > code)');
		const timelineCodeBlock = Array.from(codeBlocks).find((block) => {
			const codeElement = block.querySelector('pre > code');
			return codeElement?.textContent === '{ "type": "mount", "component": "SedimentTimeline" }';
		}) as HTMLElement | undefined;

		if (!timelineCodeBlock || !timelineCodeBlock.firstElementChild) {
			console.error('Timeline code block not found in the article.');
			return;
		}

		const target = document.createElement('div');
		target.style.margin = '0 auto';
		timelineCodeBlock.firstElementChild.innerHTML = '';
		timelineCodeBlock.firstElementChild.appendChild(target);
		mount(SedimentTimeline, { target });
	}

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Sediment Aggradation - Lake Conestee Dam</title>
</svelte:head>

<StoryMapEmbed
	story={data.story}
	loadingHeight="calc(100dvh - var(--header-height))"
	onStoryLoaded={(article) => {
		replaceTimelinePlaceholder(article);
	}}
/>
