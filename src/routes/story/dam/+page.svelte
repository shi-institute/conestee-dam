<script lang="ts">
	import { StoryMapEmbed } from '$lib/components';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>The New Dam - Lake Conestee Dam</title>
</svelte:head>

<StoryMapEmbed story={data.story} navigation loadingHeight="calc(100dvh - var(--header-height))" />
