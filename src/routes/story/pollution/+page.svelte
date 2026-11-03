<script lang="ts">
	import type { PageProps } from './$types';
	import { StoryMapEmbed } from '$lib/components';
	import { findStory } from '$lib/stories';
	import PollutionInfographics from './PollutionInfographics.svelte';
	import PollutionTimeline from './PollutionTimeline.svelte';

	let { data }: PageProps = $props();

	const byline = findStory('/story/pollution')?.byline;
</script>

<svelte:head>
	<title>Pollution in Lake Conestee - Lake Conestee Dam</title>
</svelte:head>

<StoryMapEmbed
	story={data.story}
	{byline}
	loadingHeight="calc(100dvh - var(--header-height))"
	navigation
	components={{ PollutionTimeline, PollutionInfographics }}
/>
