<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import HeaderMenu from './HeaderMenu.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<HeaderMenu />

{@render children()}
