<script lang="ts">
	import { onMount } from 'svelte';

	let unsupported = $state(false);

	// the service worker proxies the archive, but it is not in control on the first visit
	// (or after client-side navigation), so wait for it and then load the page through it
	onMount(() => {
		if (!('serviceWorker' in navigator)) {
			unsupported = true;
			return;
		}

		const reload = () => location.reload();
		if (navigator.serviceWorker.controller) {
			reload();
			return;
		}

		navigator.serviceWorker.addEventListener('controllerchange', reload, { once: true });
		return () => navigator.serviceWorker.removeEventListener('controllerchange', reload);
	});
</script>

<main>
	{#if unsupported}
		<p>
			Your browser cannot load the archive here.
			<a href="https://shi-institute.github.io/conestee-dam-archive/">Open the archive directly</a>.
		</p>
	{:else}
		<p>Loading the archive…</p>
	{/if}
</main>

<style>
	main {
		padding: 6rem 1rem;
		text-align: center;
	}
</style>
