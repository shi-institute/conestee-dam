<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import favicon from '$lib/assets/favicon.svg';
	import { markHydrated } from '$lib/components';
	import { onMount } from 'svelte';
	import HeaderMenu from './HeaderMenu.svelte';
	import NavigationProgress from './NavigationProgress.svelte';

	let { children } = $props();

	// once we mount for the first time, navigating to a story page waits for the story to load
	onMount(markHydrated);

	// animate between pages with a view transition when the browser supports it
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		if (navigation.from?.url.pathname === navigation.to?.url.pathname) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<NavigationProgress />
<HeaderMenu />

{@render children()}

<style>
	/* the page content fades out, then the new page fades in while rising slightly */
	:global(::view-transition-old(root)) {
		animation: page-out 120ms cubic-bezier(0.455, 0.03, 0.515, 0.955) both;
	}

	:global(::view-transition-new(root)) {
		animation: page-in 250ms cubic-bezier(0, 0, 0, 1) 80ms both;
	}

	@keyframes -global-page-out {
		to {
			opacity: 0;
		}
	}

	@keyframes -global-page-in {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
	}
</style>
