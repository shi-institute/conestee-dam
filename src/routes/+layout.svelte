<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { asset } from '$app/paths';
	import favicon from '$lib/assets/favicon.svg';
	import { markHydrated } from '$lib/components';
	import { GlossaryDialog } from '$lib/glossary';
	import { onMount } from 'svelte';
	import HeaderMenu from './HeaderMenu.svelte';
	import NavigationProgress from './NavigationProgress.svelte';
	import SiteFooter from './SiteFooter.svelte';

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
	<link rel="apple-touch-icon" href={asset('apple-touch-icon.png')} />
	<link rel="manifest" href={asset('manifest.webmanifest')} />
</svelte:head>

<NavigationProgress />
<HeaderMenu />
<GlossaryDialog />

{@render children()}

<SiteFooter />

<style>
	/* the ArcGIS Maps SDK (loaded by stories with maps) sets `:root { view-transition-name: none }`,
	which would disable the page transition for every later navigation */
	:global(html:root) {
		view-transition-name: root;
	}

	/* glossary terms linked by `linkGlossaryTerms` are subtle so that prose with many terms
	is still easy to read */
	:global(a.glossary-term) {
		color: inherit;
		font: inherit;
		text-decoration-line: underline;
		text-decoration-style: dotted;
		text-decoration-thickness: 1.5px;
		text-decoration-color: var(--color-accent);
		text-underline-offset: 0.2em;
		cursor: help;
	}
	:global(a.glossary-term:hover) {
		text-decoration-style: solid;
		color: var(--color-accent);
	}

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
