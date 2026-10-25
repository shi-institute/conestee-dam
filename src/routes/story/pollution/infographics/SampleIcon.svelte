<script module lang="ts">
	export type SampleType = 'exposed' | 'submerged' | 'downriver' | 'water' | 'fish';
</script>

<script lang="ts">
	const { type }: { type: SampleType } = $props();
</script>

<svg
	viewBox="0 0 40 40"
	aria-hidden="true"
	fill="none"
	stroke="currentColor"
	stroke-width="2.2"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	{#if type === 'exposed'}
		<circle cx="29" cy="10" r="4.5" />
		<path d="M4 22c4-3 8-3 12 0s8 3 12 0 8-3 8-3" />
		<path d="M4 29h32M4 35h32" />
	{:else if type === 'submerged'}
		<path d="M4 9c3-2 6-2 9 0s6 2 9 0 6-2 9 0 4 1 5 0" />
		<path d="M4 15c3-2 6-2 9 0s6 2 9 0 6-2 9 0 4 1 5 0" opacity=".5" />
		<path d="M4 25h32M4 30h32M4 35h32" />
	{:else if type === 'downriver'}
		<path d="M5 12h26M25 6l6 6-6 6" />
		<path d="M4 26h32M4 32h32" />
	{:else if type === 'water'}
		<path d="M20 5c6 8 10 13 10 18a10 10 0 0 1-20 0c0-5 4-10 10-18z" />
		<path d="M15 25a5 5 0 0 0 5 5" />
	{:else if type === 'fish'}
		<path d="M5 20c5-7 13-9 20-6 3 1 5 3 7 6-2 3-4 5-7 6-7 3-15 1-20-6z" />
		<path d="M32 20l5-5v10z" />
		<circle cx="12" cy="18.5" r="1.3" fill="currentColor" stroke="none" />
	{/if}
</svg>

<style>
	svg {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
