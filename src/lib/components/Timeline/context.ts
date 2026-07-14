import { getContext, setContext } from 'svelte';

const TIMELINE_TRACK_KEY = Symbol('timeline-track');

export type TimelineDate = number | { start: number; end: number };

export interface TimelineTrackRegistration {
	id: number;
	order: number;
}

export interface TimelineTrackContext {
	/**
	 * Registers a timeline entry with the timeline track.
	 *
	 * The register function returns registration details that the
	 * entry must use to set its CSS `order` so that the track can interleave
	 * year headings between entries. The registration details should also
	 * be used by the entry to unregister itself when it is destroyed.
	 */
	register: (date: TimelineDate | undefined) => TimelineTrackRegistration;
	/**
	 * Unregisters a timeline entry from the timeline track.
	 */
	unregister: (id: number) => void;
}

export function setTimelineTrackContext(ctx: TimelineTrackContext) {
	setContext(TIMELINE_TRACK_KEY, ctx);
}

export function getTimelineTrackContext(): TimelineTrackContext | undefined {
	return getContext(TIMELINE_TRACK_KEY);
}
