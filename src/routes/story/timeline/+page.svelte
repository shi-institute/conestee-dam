<script lang="ts">
	import type { PageProps } from './$types';
	import { StoryMapEmbed } from '$lib/components';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Timeline - Lake Conestee Dam</title>
</svelte:head>

<StoryMapEmbed story={data.story} loadingHeight="calc(100dvh - var(--header-height))" />
