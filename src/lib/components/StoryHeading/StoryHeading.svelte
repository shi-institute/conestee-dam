<script lang="ts">
	const { title, summary, image } = $props<{
		/** The title of the story. */
		title: string;

		/** A short description of the story that is shown below the title. */
		summary?: string;

		/**
		 * The cover photo of the story.
		 *
		 * While `src` is missing, space is reserved for the photo so that the
		 * story does not shift once the photo is available.
		 */
		image?: { src?: string; srcset?: string; alt: string };
	}>();
</script>

<header class="story-heading" class:has-image={!!image} data-glossary-ignore>
	<div class="text">
		<h1>{title}</h1>
		{#if summary}
			<p class="summary">{summary}</p>
		{/if}
	</div>
	{#if image?.src}
		<img
			class="image"
			src={image.src}
			srcset={image.srcset}
			sizes="(min-width: 900px) 52rem, 100vw"
			alt={image.alt}
			loading="eager"
		/>
	{:else if image}
		<div class="image" aria-hidden="true"></div>
	{/if}
</header>

<style>
	.story-heading {
		--gutter: 1rem;
		--accent: light-dark(#4868a9, #c5dbff);
		box-sizing: border-box;
		width: 100%;
		max-width: calc(52rem + 2 * var(--gutter));
		margin: 0 auto;
		padding: clamp(2.5rem, 7vw, 3.5rem) var(--gutter) clamp(1.5rem, 4vw, 2.5rem);
		display: flex;
		flex-direction: column;
		gap: clamp(1.5rem, 4vw, 2.25rem);
	}

	.story-heading:not(.has-image) {
		padding-bottom: 0;
	}
	.story-heading:not(.has-image)::after {
		content: '';
		display: block;
		height: 1px;
		background-color: light-dark(#d8e0ee, #3f4654);
	}

	.text {
		/* padding-left: clamp(1rem, 2.5vw, 1.5rem);
		border-left: 4px solid var(--accent); */
	}

	h1 {
		margin: 0;
		font-size: clamp(2.25rem, 6vw, 3.25rem);
		font-weight: 800;
		line-height: 1.05;
		letter-spacing: -0.02em;
		text-wrap: balance;
	}

	.summary {
		margin: 0.75rem 0 0;
		max-width: 42ch;
		font-size: clamp(1.125rem, 2.2vw, 1.375rem);
		line-height: 1.4;
		color: light-dark(#4a5568, #b8c0cc);
		text-wrap: pretty;
	}

	.image {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		border-radius: 0.5rem;
		background-color: light-dark(#e8eef8, #2c2f36);
		box-shadow: inset 0 0 0 1px rgba(0 0 0 / 15%);
	}

	img.image {
		animation: fade-in 300ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		img.image {
			animation: none;
		}
	}
</style>
