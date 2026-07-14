<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setTimelineTrackContext, type TimelineDate } from './context';
	import TimelineYear from './TimelineYear.svelte';

	const { children } = $props<{
		/** The Timeline.Entry components to render inside the track. */
		children: Snippet;
	}>();

	let nextId = 0;
	let entries = $state<{ id: number; date: TimelineDate; order: number }[]>([]);

	function yearOf(date: TimelineDate): number {
		return typeof date === 'number' ? date : date.start;
	}

	function register(date: TimelineDate | undefined) {
		const id = nextId++;

		// multiplying the id by 2 ensures a gap between each entry order, making it
		// possible to insert year headings between entries using only CSS `order`.
		const order = id * 2 + 1;

		if (date !== undefined) {
			entries = [...entries, { id, date, order }];
		}

		return { id, order };
	}

	function unregister(id: number) {
		entries = entries.filter((entry) => entry.id !== id);
	}

	// expose the register and unregister functions to timeline entries via context
	setTimelineTrackContext({ register, unregister });

	// configure a heading for wherever the year changes from the previous entry.
	const headings = $derived.by(() => {
		const result: { entryId: number; order: number; year: number }[] = [];

		let lastYear: number | undefined;
		entries.forEach((entry, index) => {
			const year = yearOf(entry.date);
			if (index === 0 || year !== lastYear) {
				result.push({ entryId: entry.id, order: entry.order - 1, year });
				lastYear = year;
			}
		});
		return result;
	});
</script>

<div class="timeline-track">
	<div class="timeline-track-rail"></div>
	<div class="timeline-track-entries">
		<!--
		  We render entries first so that SSR sees them register before
			we render the headings. If we render headings first, the children
			entries will not yet be registered, so no headings will be rendered
			either.
		-->
		{@render children()}
		{#each headings as heading (heading.entryId)}
			<div style="order: {heading.order}">
				<TimelineYear year={heading.year} />
			</div>
		{/each}
	</div>
</div>

<style>
	.timeline-track {
		position: relative;
	}

	.timeline-track-rail {
		position: absolute;
		z-index: 0;
		top: 0.5rem;
		bottom: 0.5rem;
		left: 0;
		width: 3rem;
		background-image: repeating-linear-gradient(
			to bottom,
			#d0d0d0 0,
			#d0d0d0 2px,
			transparent 2px,
			transparent 10px
		);
	}

	.timeline-track-entries {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
	}
</style>
