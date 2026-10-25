<script lang="ts">
	import type { PageProps } from './$types';
	import { StoryMapEmbed } from '$lib/components';
	import { mount, type Component } from 'svelte';
	import PollutionInfographics from './PollutionInfographics.svelte';
	import PollutionTimeline from './PollutionTimeline.svelte';

	function replacePlaceholder(article: HTMLElement, name: string, component: Component) {
		const codeBlocks = article.querySelectorAll('div:has(> div > pre > code)');
		const placeholderCodeBlock = Array.from(codeBlocks).find((block) => {
			const codeElement = block.querySelector('pre > code');
			return codeElement?.textContent === `{ "type": "mount", "component": "${name}" }`;
		}) as HTMLElement | undefined;

		if (!placeholderCodeBlock || !placeholderCodeBlock.firstElementChild) {
			console.error(`${name} code block not found in the article.`);
			return;
		}

		const target = document.createElement('div');
		target.style.margin = '0 auto';
		placeholderCodeBlock.firstElementChild.innerHTML = '';
		placeholderCodeBlock.firstElementChild.appendChild(target);
		mount(component, { target });
	}

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Pollution in Lake Conestee - Lake Conestee Dam</title>
</svelte:head>

<StoryMapEmbed
	story={data.story}
	loadingHeight="calc(100dvh - var(--header-height))"
	navigation
	onStoryLoaded={(article) => {
		replacePlaceholder(article, 'PollutionTimeline', PollutionTimeline);
		replacePlaceholder(article, 'PollutionInfographics', PollutionInfographics);
	}}
/>
