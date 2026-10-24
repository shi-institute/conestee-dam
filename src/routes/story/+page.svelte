<script lang="ts">
	import { StoryMapEmbed } from '$lib/components';
</script>

<svelte:head>
	<title>Documentary</title>
</svelte:head>

<StoryMapEmbed
	storyId="b3daea8f94a14558b386108914d9d3b9"
	loadingHeight="calc(100dvh - var(--header-height))"
	class="documentary-storymap"
/>

<style>
	/* support dark mode on documentary page because it has lots of videos */
	:global(:root:has(.documentary-storymap)) {
		color-scheme: dark;
	}
</style>
