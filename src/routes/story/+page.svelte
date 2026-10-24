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
</svelte:head>

<StoryMapEmbed
	story={data.story}
	loadingHeight="calc(100dvh - var(--header-height))"
	class="documentary-storymap"
	onStoryLoaded={(article) => {
		replaceTitle(article);
	}}
/>

<style>
	/* support dark mode on documentary page because it has lots of videos */
	:global(:root:has(.documentary-storymap)) {
		color-scheme: dark;
	}
</style>
