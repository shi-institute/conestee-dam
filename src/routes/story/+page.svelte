<script lang="ts">
	import type { PageProps } from './$types';
	import { StoryMapEmbed } from '$lib/components';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Documentary - Lake Conestee Dam</title>
</svelte:head>

<StoryMapEmbed
	story={data.story}
	loadingHeight="calc(100dvh - var(--header-height))"
	class="documentary-storymap"
/>

<style>
	/* support dark mode on documentary page because it has lots of videos */
	:global(:root:has(.documentary-storymap)) {
		color-scheme: dark;
	}
</style>
