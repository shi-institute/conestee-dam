<script lang="ts">
	import { untrack, type Snippet } from 'svelte';
	import { getTimelineTrackContext, type TimelineDate } from './context';

	const {
		headingLevel = 'h2',
		heading,
		caption,
		children,
		icon,
		date
	} = $props<{
		headingLevel?: `h${1 | 2 | 3 | 4 | 5 | 6}`;
		/**
		 * The snippet that appears as the heading for the timeline entry.
		 * It is prominently shown when the entry is collapsed and expanded.
		 */
		heading: Snippet;
		/**
		 * The snippet that appears under the heading for the timeline entry.
		 */
		caption?: Snippet;
		/**
		 * The content of the timeline entry that is shown when the entry is expanded.
		 */
		children?: Snippet;
		icon?: {
			src: string;
			alt: string;
		};
		/**
		 * The year (or start year of a range) this entry represents. When this
		 * entry is inside a Timeline.Track, it is used to place year headings
		 * along the track at reasonable intervals.
		 */
		date?: TimelineDate;
	}>();

	const track = getTimelineTrackContext();
	const registration = track?.register(untrack(() => date));

	$effect(() => {
		return () => {
			if (registration) track?.unregister(registration.id);
		};
	});
</script>

<details style={registration ? `order: ${registration.order}` : undefined}>
	<summary>
		<div class="timeline-entry-line">
			<div class="line"></div>
		</div>

		<img src={icon?.src} alt={icon?.alt} class="timeline-entry-icon" />

		<div class="timeline-entry-summary-content">
			<svelte:element this={headingLevel} class="timeline-entry-heading">
				{@render heading()}
			</svelte:element>
			{#if caption}
				<p class="timeline-entry-caption">
					{@render caption()}
				</p>
			{/if}
		</div>
	</summary>

	{@render children?.()}
</details>

<style>
	details {
		--tl-line-width: 3rem;
		--tl-line-gap: 0.5rem;

		margin-inline-start: calc(var(--tl-line-width) + var(--tl-line-gap));
		transition: margin-block 120ms ease;
	}

	summary {
		display: flex;
		flex-direction: row;
		user-select: none;
		align-items: center;
		min-height: 3.5rem;
		cursor: pointer;
	}

	.timeline-entry-line {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		width: var(--tl-line-width);
		margin-inline-start: calc(-1 * var(--tl-line-width) - var(--tl-line-gap));
		margin-inline-end: var(--tl-line-gap);
		height: 0.25rem;
		flex-grow: 0;
		flex-shrink: 0;
	}
	.timeline-entry-line .line {
		width: calc(var(--tl-line-width) / 2);
		height: 100%;
		background-color: black;
		transition: width 120ms ease;
	}
	:is(details:hover, details:focus-within) .timeline-entry-line .line {
		width: 100%;
	}

	.timeline-entry-icon {
		block-size: 3rem;
		inline-size: 3rem;
		background-color: aquamarine;
		border: none;
		border-radius: 0.25rem;
		margin-right: 0.5rem;
		transition: 120ms ease;
		object-fit: cover;
		flex-grow: 0;
		flex-shrink: 0;
	}
	:is(details[open], summary:hover, summary:focus-visible) .timeline-entry-icon {
		block-size: 3.5rem;
		inline-size: 3.5rem;
	}

	.timeline-entry-summary-content {
		flex-grow: 1;
		align-self: stretch;
		border-radius: 0.25rem;
		transition: 120ms ease;
		border: 0px solid transparent;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0.25rem 1.5rem 0.25rem 0.5rem;
	}
	details[open] .timeline-entry-summary-content {
		border-radius: 0.25rem 0.25rem 0 0;
	}
	:is(details[open], summary:hover, summary:focus-visible) .timeline-entry-summary-content {
		border: 1px solid #dedede;
		padding-right: 1rem;
		padding-left: 1rem;
	}
	:is(summary:hover, summary:focus-visible) .timeline-entry-summary-content {
		box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
	}

	.timeline-entry-heading {
		font-size: 1rem;
		font-weight: 600;
		margin: 0;
		text-box: trim-both cap alphabetic;
		transition: font-size 160ms ease;
	}
	details[open] .timeline-entry-heading {
		font-size: 1.5rem;
		margin: 1.5rem 0;
	}
	details[open] .timeline-entry-heading:has(+ .timeline-entry-caption) {
		margin-bottom: 0;
	}

	.timeline-entry-caption {
		margin: 0;
		margin-top: 0.5rem;
		font-size: 0.875rem;
		text-box: trim-both cap alphabetic;
		transition: font-size 160ms ease;
	}
	details[open] .timeline-entry-caption {
		margin: 1rem 0 1.5rem 0;
		font-size: 1.125rem;
	}

	details::details-content {
		height: 0;
		display: block;
		overflow: hidden;
		content-visibility: hidden;
		interpolate-size: allow-keywords;
		transition:
			height 340ms ease,
			padding 120ms ease,
			content-visibility 340ms allow-discrete;
		margin-left: 4rem;
	}
	:is(details[open], details:has(summary:hover, summary:focus-visible))::details-content {
		padding-right: 1rem;
		padding-left: 1rem;
	}
	details[open]::details-content {
		height: auto;
		content-visibility: visible;
		border: 1px solid #dedede;
		border-top: 0;
		border-radius: 0 0 0.25rem 0.25rem;
	}
	@starting-style {
		details[open]::details-content {
			height: 0;
		}
	}

	details[open] {
		margin-block: 0.25rem;
	}

	/* children styles */
	:is(details :global(img)) {
		max-width: 100%;
		height: auto;
	}
</style>
