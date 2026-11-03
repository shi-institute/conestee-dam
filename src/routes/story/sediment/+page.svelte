<script lang="ts">
	import type { PageProps } from './$types';
	import { StoryMapEmbed } from '$lib/components';
	import { findStory } from '$lib/stories';
	import SedimentTimeline from './SedimentTimeline.svelte';

	let { data }: PageProps = $props();

	const byline = findStory('/story/sediment')?.byline;
</script>

<svelte:head>
	<title>Sediment Aggradation - Lake Conestee Dam</title>
</svelte:head>

<StoryMapEmbed
	story={data.story}
	{byline}
	loadingHeight="calc(100dvh - var(--header-height))"
	navigation
	components={{ SedimentTimeline }}
/>
