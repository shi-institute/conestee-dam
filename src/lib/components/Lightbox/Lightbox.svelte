<script lang="ts">
	const MIN_SCALE = 1;
	const MAX_SCALE = 6;
	const ZOOM_SPEED = 0.0015;

	let {
		open = $bindable(false),
		src = '',
		alt = ''
	}: {
		open?: boolean;
		src?: string;
		alt?: string;
	} = $props();

	let dialog: HTMLDialogElement;
	let viewportEl: HTMLElement;
	let imageEl: HTMLImageElement;

	let scale = $state(1);
	let panX = $state(0);
	let panY = $state(0);
	let isDragging = $state(false);
	/**
	 * Whether the image is currently larger than the viewport in either
	 * dimension. If it is not larger, there is no need to pan the image.
	 */
	let canPan = $state(false);

	// drag state does not need to be reactive since it is only used inside pointer event handlers
	let dragPointerId = -1;
	let dragStartX = 0;
	let dragStartY = 0;
	let dragStartPanX = 0;
	let dragStartPanY = 0;
	let dragMoved = false;

	$effect(() => {
		if (!dialog) return;
		if (open && !dialog.open) {
			dialog.showModal();
		} else if (!open && dialog.open) {
			dialog.close();
		}
	});

	function resetZoom() {
		scale = 1;
		panX = 0;
		panY = 0;
		canPan = false;
	}

	function handleDialogClose() {
		open = false;
		resetZoom();
	}

	// keeps the image from panning past its own edges, clamping harder as scale shrinks
	// toward 1 (where there's nothing left to pan)

	/**
	 * Ensures that the image cannot be panned outside of the viewport.
	 *
	 * This is most relevant when zooming in and out when the image has been
	 * panned away from the center. Without this function, when zooming out,
	 * the image could end up with a large empty space to the side of it.
	 */
	function clampPan() {
		if (!imageEl || !viewportEl) return;
		const maxPanX = Math.max(0, (imageEl.offsetWidth * scale - viewportEl.clientWidth) / 2);
		const maxPanY = Math.max(0, (imageEl.offsetHeight * scale - viewportEl.clientHeight) / 2);
		panX = Math.min(maxPanX, Math.max(-maxPanX, panX));
		panY = Math.min(maxPanY, Math.max(-maxPanY, panY));

		// do not allow panning unless the image is larger than the viewport in at least one dimension
		canPan = maxPanX > 0 || maxPanY > 0;
	}

	/**
	 * Scales the image in and out based on the scroll wheel, zooming
	 * toward the mouse cursor position.
	 */
	function handleScrollWheel(event: WheelEvent) {
		event.preventDefault();

		const viewportRect = viewportEl.getBoundingClientRect();

		// cursor position relative to the viewport center (the transform-origin)
		const cx = event.clientX - viewportRect.left - viewportRect.width / 2;
		const cy = event.clientY - viewportRect.top - viewportRect.height / 2;

		// handle zooming in/out
		const previousScale = scale;
		const nextScale = Math.min(
			MAX_SCALE,
			Math.max(MIN_SCALE, scale - event.deltaY * ZOOM_SPEED * scale)
		);
		if (nextScale === previousScale) {
			return;
		}

		// make a best effort to zoom towards the mouse cursor position
		// rather than the center of the viewport
		const ratio = nextScale / previousScale;
		panX = cx * (1 - ratio) + panX * ratio;
		panY = cy * (1 - ratio) + panY * ratio;
		scale = nextScale;

		clampPan();
	}

	/**
	 * Closes the lightbox when the user clicks on the backdrop.
	 */
	function handleViewportClick(event: MouseEvent) {
		if (dragMoved) {
			dragMoved = false;
			return;
		}

		if (event.target === event.currentTarget) {
			dialog.close();
		}
	}

	/**
	 * Handles the start of a drag operation on the image. This is only relevant
	 * when the image is zoomed in and can be panned around.
	 */
	function handlePointerDown(event: PointerEvent) {
		if (!canPan || event.button !== 0) {
			return;
		}

		event.preventDefault();
		isDragging = true;
		dragMoved = false;
		dragPointerId = event.pointerId;
		dragStartX = event.clientX;
		dragStartY = event.clientY;
		dragStartPanX = panX;
		dragStartPanY = panY;
		imageEl.setPointerCapture(event.pointerId);
	}

	/**
	 * Updates the pan position of the image based on the user's drag movement.
	 */
	function handlePointerMove(event: PointerEvent) {
		if (!isDragging || event.pointerId !== dragPointerId) {
			return;
		}

		const deltaX = event.clientX - dragStartX;
		const deltaY = event.clientY - dragStartY;
		const distance = Math.hypot(deltaX, deltaY);
		const hasMovedEnough = distance > 4;
		if (!dragMoved && hasMovedEnough) {
			dragMoved = true;
		}

		// update the pan position based on the drag distance
		panX = dragStartPanX + deltaX;
		panY = dragStartPanY + deltaY;
		clampPan();
	}

	/**
	 * Ends drag operations when the pointer is released.
	 */
	function handlePointerUp(event: PointerEvent) {
		if (event.pointerId !== dragPointerId) {
			return;
		}

		isDragging = false;
		dragPointerId = -1;
		imageEl.releasePointerCapture(event.pointerId);
	}
</script>

<dialog bind:this={dialog} class="lightbox" onclose={handleDialogClose}>
	<button type="button" class="lightbox-close" onclick={() => dialog.close()} aria-label="Close">
		<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
			<path
				d="M6 6l12 12M18 6L6 18"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
			/>
		</svg>
	</button>

	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- 	
		Clicking the backdrop closes the dialog. Escape and the 
		close button above are the keyboard-accessible equivalents. 
	-->
	<div
		bind:this={viewportEl}
		class="lightbox-viewport"
		onwheel={handleScrollWheel}
		onclick={handleViewportClick}
	>
		<img
			bind:this={imageEl}
			src={src || undefined}
			{alt}
			class="lightbox-image"
			class:zoomed={canPan}
			class:dragging={isDragging}
			style="transform: translate({panX}px, {panY}px) scale({scale});"
			draggable="false"
			onpointerdown={handlePointerDown}
			onpointermove={handlePointerMove}
			onpointerup={handlePointerUp}
			onpointercancel={handlePointerUp}
		/>
	</div>

	<p class="lightbox-hint">
		<span>Scroll to zoom</span>
		{#if canPan}
			<span>&middot;</span>
			<span>Drag to pan</span>
		{/if}
	</p>
</dialog>

<style>
	.lightbox {
		margin: 0;
		padding: 0;
		border: none;
		max-width: 100vw;
		max-height: 100vh;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.92);
		opacity: 0;
		transition:
			opacity 220ms ease,
			overlay 220ms allow-discrete,
			display 220ms allow-discrete;
	}
	.lightbox[open] {
		display: flex;
		opacity: 1;
	}
	@starting-style {
		.lightbox[open] {
			opacity: 0;
		}
	}

	.lightbox::backdrop {
		background: rgba(0, 0, 0, 0.92);
		opacity: 0;
		transition:
			opacity 220ms ease,
			overlay 220ms allow-discrete,
			display 220ms allow-discrete;
	}
	.lightbox[open]::backdrop {
		opacity: 1;
	}
	@starting-style {
		.lightbox[open]::backdrop {
			opacity: 0;
		}
	}

	.lightbox-viewport {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		overscroll-behavior: contain;
		touch-action: none;
	}

	.lightbox-image {
		max-width: 90vw;
		max-height: 90vh;
		object-fit: contain;
		cursor: default;
		touch-action: none;
		user-select: none;
		scale: 0.85;
		translate: 0 12px;
		transition:
			transform 60ms ease-out,
			scale 260ms cubic-bezier(0.16, 1, 0.3, 1),
			translate 260ms cubic-bezier(0.16, 1, 0.3, 1);
	}
	.lightbox[open] .lightbox-image {
		scale: 1;
		translate: 0 0;
	}
	.lightbox-image.zoomed {
		cursor: grab;
	}
	.lightbox-image.dragging {
		cursor: grabbing;
		transition: none;
	}

	.lightbox-hint {
		position: fixed;
		bottom: 1.25rem;
		left: 50%;
		translate: -50% 0;
		margin: 0;
		padding: 0.375rem 0.875rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.12);
		color: white;
		font-size: 0.8125rem;
		white-space: nowrap;
		pointer-events: none;
	}

	.lightbox-close {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		padding: 0;
		border: none;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.12);
		color: white;
		cursor: pointer;
		transition:
			background-color 120ms ease,
			scale 120ms ease;
	}
	.lightbox-close:hover,
	.lightbox-close:focus-visible {
		background: rgba(255, 255, 255, 0.24);
	}
	.lightbox-close:active {
		background: rgba(255, 255, 255, 0.36);
		scale: 0.9;
	}
</style>
