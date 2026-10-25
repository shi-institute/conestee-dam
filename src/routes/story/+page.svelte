<script lang="ts">
	import { ProjectTitle, StoryMapEmbed } from '$lib/components';
	import { mount } from 'svelte';
	import type { PageProps } from './$types';

	function replaceTitle(article: HTMLElement) {
		const firstBlock = article.querySelector('div:first-child .grid-item-lite');

		if (!firstBlock || !firstBlock.firstElementChild) {
			console.error('First block not found in the article.');
			return;
		}

		const target = document.createElement('div');
		target.style.margin = '0 auto';
		firstBlock.firstElementChild.innerHTML = '';
		firstBlock.firstElementChild.appendChild(target);
		mount(ProjectTitle, { target });
	}

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Documentary - Lake Conestee Dam</title>
	{#if 'redirectTo' in data}
		<meta http-equiv="refresh" content="0;url={data.redirectTo}" />
		{@html `<script>location.replace(${JSON.stringify(data.redirectTo)});</script>`}
	{/if}
</svelte:head>

{#if 'story' in data && data.story !== undefined}
	<StoryMapEmbed
		story={data.story}
		loadingHeight="calc(100dvh - var(--header-height))"
		class="documentary-storymap"
		heading={false}
		onStoryLoaded={(article) => {
			replaceTitle(article);
		}}
	/>
{/if}

<style>
	/* support dark mode on documentary page because it has lots of videos */
	:global(:root:has(.documentary-storymap)) {
		color-scheme: dark;
	}
</style>
