<script lang="ts">
	import { wrapImagesInLightbox } from '$components/Lightbox';
	import type { BylinePhoto, ResolvedByline } from '$lib/bylines';
	import type { Attachment } from 'svelte/attachments';

	const { byline }: { byline: ResolvedByline } = $props();

	/**
	 * Makes the photo for the other color scheme inert, so that only the visible photo
	 * can be focused and opened in the lightbox.
	 */
	const disableHiddenPhoto: Attachment<HTMLElement> = (node) => {
		const update = () => {
			// the probe's color resolves `light-dark()` with the page's color scheme
			const probe = document.createElement('span');
			probe.style.color = 'light-dark(rgb(0, 0, 0), rgb(255, 255, 255))';
			node.appendChild(probe);
			const isDark = getComputedStyle(probe).color === 'rgb(255, 255, 255)';
			probe.remove();

			for (const img of node.querySelectorAll('img')) {
				img.inert = img.classList.contains(isDark ? 'light' : 'dark');
			}
		};

		update();
		const query = matchMedia('(prefers-color-scheme: dark)');
		query.addEventListener('change', update);
		return () => query.removeEventListener('change', update);
	};
</script>

{#snippet photo(picture: BylinePhoto, scheme?: 'light' | 'dark')}
	{#if typeof picture === 'string'}
		<img class={scheme} src={picture} alt={byline.name} />
	{:else}
		<enhanced:img class={scheme} src={picture} alt={byline.name} sizes="2.75rem" />
	{/if}
{/snippet}

<div class="byline">
	{#if byline.picture}
		<div
			class="photo"
			class:borderless={byline.photo_border === false}
			{@attach wrapImagesInLightbox}
		>
			{#if byline.pictureDark}
				<div class="photos" {@attach disableHiddenPhoto}>
					{@render photo(byline.picture, 'light')}
					{@render photo(byline.pictureDark, 'dark')}
				</div>
			{:else}
				{@render photo(byline.picture)}
			{/if}
		</div>
	{/if}
	<div class="text">
		<p class="name">
			By
			{#if byline.url}
				<a href={byline.url}>{byline.name}</a>
			{:else}
				<span>{byline.name}</span>
			{/if}
		</p>
		<p class="title">{byline.title}</p>
	</div>
</div>

<style>
	.byline {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		line-height: 1.3;
	}

	.photo {
		flex: none;
		display: grid;
		width: 2.75rem;
		height: 2.75rem;
		overflow: hidden;
		border-radius: 50%;
		background-color: light-dark(#fff, #1f2125);
		box-shadow: inset 0 0 0 1px var(--color-border);
	}

	/* without a border, the photo's background would only outline it */
	.photo.borderless {
		background-color: transparent;
		box-shadow: none;
	}

	.photos,
	.photo :global(picture) {
		display: contents;
	}

	.photo :global(img) {
		grid-area: 1 / 1;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: opacity 80ms ease-in-out;
	}
	.photo :global(img:active) {
		opacity: 0.85;
	}

	/*
	 * Only the photo for the page's color scheme is shown. The mask follows `color-scheme`
	 * (unlike a media query), so pages that force a color scheme are respected.
	 */
	.photo :global(img.light) {
		mask-image: linear-gradient(light-dark(#000, transparent), light-dark(#000, transparent));
	}
	.photo :global(img.dark) {
		mask-image: linear-gradient(light-dark(transparent, #000), light-dark(transparent, #000));
	}

	.text {
		min-width: 0;
	}

	p {
		margin: 0;
	}

	.name {
		font-size: 0.9375rem;
		color: var(--color-text);
	}

	.name span,
	.name a {
		font-weight: 700;
	}

	.name a {
		color: inherit;
		text-decoration: none;
	}
	.name a:hover {
		color: var(--color-accent);
		text-decoration: underline;
	}

	.title {
		font-size: 0.8125rem;
		color: var(--color-muted);
	}
</style>
