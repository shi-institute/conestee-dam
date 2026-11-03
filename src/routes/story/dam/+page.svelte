<script lang="ts">
	import { StoryMapEmbed } from '$lib/components';
	import { findStory } from '$lib/stories';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const byline = findStory('/story/dam')?.byline;
</script>

<svelte:head>
	<title>The New Dam - Lake Conestee Dam</title>
</svelte:head>

<StoryMapEmbed
	story={data.story}
	{byline}
	navigation
	loadingHeight="calc(100dvh - var(--header-height))"
/>
