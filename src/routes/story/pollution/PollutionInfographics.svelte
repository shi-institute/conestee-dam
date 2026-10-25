<script lang="ts">
	import type { Snippet } from 'svelte';
	import PfasLevels from './infographics/PfasLevels.svelte';
	import ScreeningValues from './infographics/ScreeningValues.svelte';

	const slides: { narrative: Snippet; figure: Snippet }[] = [
		{ narrative: heavyMetalsNarrative, figure: heavyMetalsFigure },
		{ narrative: pahsNarrative, figure: pahsFigure },
		{ narrative: pcbsNarrative, figure: pcbsFigure },
		{ narrative: pesticidesNarrative, figure: pesticidesFigure },
		{ narrative: pfasNarrative, figure: pfasFigure }
	];

	/** The slide whose narrative is in the middle of the viewport. */
	let activeIndex = $state(0);

	// show the figure for a slide once its narrative reaches the middle of the viewport
	function observeSlide(index: number) {
		return (slide: HTMLElement) => {
			const observer = new IntersectionObserver(
				(entries) => {
					if (entries.some((entry) => entry.isIntersecting)) activeIndex = index;
				},
				{ rootMargin: '-50% 0px -50% 0px' }
			);
			observer.observe(slide);
			return () => observer.disconnect();
		};
	}
</script>

{#snippet heavyMetalsNarrative()}
	<p><strong>Heavy Metals (Cadmium, Chromium, Copper, Lead, Zinc):</strong></p>
	<p>
		Naturally occurring. Also used in various industries, including textiles, electroplating, and
		metal finishing. These stable elements do not break down in the environment, remain bound to
		riverbed sediments indefinitely, and can affect multiple organ systems, including known or
		suspected carcinogens (EPA).
	</p>
{/snippet}
{#snippet heavyMetalsFigure()}
	<ScreeningValues
		contaminant="metals"
		humanHealth={[
			['exposed', 100],
			['water', 100],
			['fish', 11]
		]}
		ecological={[
			['exposed', 100],
			['submerged', 98],
			['downriver', 40],
			['water', 100]
		]}
	/>
{/snippet}

{#snippet pahsNarrative()}
	<p><strong>Polycyclic Aromatic Hydrocarbons (PAHs):</strong></p>
	<p>
		Found in coal tar, coal gas, creosote, road and roofing tar, asphalt, and petroleum distillates.
		These chemicals can impact human health in a variety of ways depending on the type of PAHs, and
		may cause “harmful effects on skin, body fluids, and the body’s system for fighting disease.”
		Several of these chemicals are known carcinogens (CDC).
	</p>
{/snippet}
{#snippet pahsFigure()}
	<ScreeningValues
		contaminant="PAHs"
		humanHealth={[
			['exposed', 86],
			['water', 3]
		]}
		ecological={[
			['exposed', 86],
			['submerged', 92],
			['downriver', 80]
		]}
	/>
{/snippet}

{#snippet pcbsNarrative()}
	<p><strong>Polychlorinated Biphenyls (PCBs):</strong></p>
	<p>
		Used in electrical transformers and capacitors, in some textile processing, and in a variety of
		other industrial processes. The sale and new use of PCBs were banned in the US in the early
		1970s, but PCBs still persist in the environment. These chemicals have been demonstrated to be
		linked to a variety of adverse human (and animal) health effects, including reproductive
		effects, developmental effects, neurological effects, endocrine disruption, cancer risks,
		compromised immune system, and more (EPA).
	</p>
{/snippet}
{#snippet pcbsFigure()}
	<ScreeningValues
		contaminant="PCBs"
		humanHealth={[
			['exposed', 0],
			['water', 3],
			['fish', 0]
		]}
		ecological={[
			['exposed', 14],
			['submerged', 42],
			['downriver', 20],
			['water', 3]
		]}
	/>
{/snippet}

{#snippet pesticidesNarrative()}
	<p><strong>Pesticides:</strong></p>
	<p>
		Substances intended to kill or control pests such as weeds, insects, rodents, fungi, bacteria,
		or other organisms. The human health effects vary by pesticide type; however, they may affect
		the nervous system, be carcinogens, or affect the body’s hormone or endocrine system (EPA).
	</p>
{/snippet}
{#snippet pesticidesFigure()}
	<ScreeningValues
		contaminant="pesticides"
		humanHealth={[
			['exposed', 37],
			['water', 30],
			['fish', 56]
		]}
		ecological={[
			['exposed', 57],
			['submerged', 72],
			['downriver', 80],
			['water', 0]
		]}
	/>
{/snippet}

{#snippet pfasNarrative()}
	<p><strong>Per- and Polyfluoroalkyl Substances (PFAS):</strong></p>
	<p>
		Commonly known as ‘forever chemicals,’ these artificial chemicals are found in non-stick
		cookware, waterproof and fire-resistant clothing, stain-resistant carpets, food packaging, and
		firefighting foam. PFAS are extremely persistent in the environment (hence the ‘forever’
		distinction). PFAS are known to accumulate in blood, soil, water, and wildlife and are
		associated with human health risks, including reproductive and developmental effects, cancer
		risk, compromised immune system, and more (EPA).
	</p>
	<p>
		After decades of use in industry, the EPA listed specific common PFAS compounds (PFOS and PFOA)
		as hazardous substances in 2024. These compounds are toxic at incredibly low concentrations,
		with drinking water standards now as low as 4 ng/L (ppt).
	</p>
{/snippet}
{#snippet pfasFigure()}
	<PfasLevels />
{/snippet}

<div class="sidecar">
	<div class="narrative">
		{#each slides as slide, index (index)}
			<section class="slide" class:active={index === activeIndex} {@attach observeSlide(index)}>
				<div class="slide-text">
					{@render slide.narrative()}
				</div>
				<!-- on narrow screens, each slide shows its figure below its narrative -->
				<figure class="inline-figure">
					{@render slide.figure()}
				</figure>
			</section>
		{/each}
	</div>

	<!-- on wide screens, the figure for the active slide stays beside the narrative -->
	<div class="media">
		<div class="stage">
			{#each slides as slide, index (index)}
				<figure
					class="media-figure"
					class:active={index === activeIndex}
					inert={index !== activeIndex}
					aria-hidden={index !== activeIndex}
				>
					<div class="card">
						{@render slide.figure()}
					</div>
				</figure>
			{/each}
		</div>
		<!-- <p class="progress" aria-hidden="true">
			{#each slides.keys() as index (index)}
				<span class="dot" class:active={index === activeIndex}></span>
			{/each}
			<span class="count">{activeIndex + 1} / {slides.length}</span>
		</p> -->
	</div>
</div>

<style>
	/* undo the margin and padding reset applied by StoryMaps */
	* {
		margin: revert;
		padding: revert;
	}

	.sidecar {
		/* break out of the story's text column so the sidecar spans the page, like a StoryMaps sidecar */
		width: 100vw;
		margin-inline: calc(50% - 50vw);
		display: grid;
		grid-template-columns: minmax(20rem, 1fr) 2fr;
		font-family:
			greycliff-cf,
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			sans-serif;
		color: var(--color-text);
		text-align: start;
	}

	.narrative {
		grid-column: 1;
		grid-row: 1;
		background-color: var(--color-surface);
		border-inline-end: 1px solid var(--color-border);
	}

	.slide {
		min-height: calc(100dvh - var(--header-height));
		padding: 3rem 2.5rem;
		box-sizing: border-box;
		/* center the narrative vertically so it lines up with the figure beside it */
		display: flex;
		flex-direction: column;
		justify-content: center;
		opacity: 0.4;
		transition: opacity 300ms cubic-bezier(0.16, 1, 0.3, 1);
	}
	.slide.active {
		opacity: 1;
	}

	.slide-text {
		font-size: 1.125rem;
		line-height: 1.6;
	}
	.slide-text p {
		margin: 0 0 1em;
		padding: 0;
	}
	.slide-text p:last-child {
		margin-bottom: 0;
	}

	figure {
		margin: 0;
		padding: 0;
	}
	.inline-figure {
		display: none;
	}

	.media {
		grid-column: 2;
		grid-row: 1;
		align-self: start;
		position: sticky;
		top: var(--header-height);
		height: calc(100dvh - var(--header-height));
		display: flex;
		flex-direction: column;
		background-color: var(--color-accent-bg);
	}

	.stage {
		position: relative;
		flex: 1;
		/* the figures scale with the space available to them */
		container-type: size;
	}

	.media-figure {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 2rem 0;
		font-size: clamp(0.75rem, min(2.4cqh, 1.6cqw), 1.125rem);
		opacity: 0;
		transition: opacity 300ms cubic-bezier(0.16, 1, 0.3, 1);
	}
	.media-figure.active {
		opacity: 1;
	}

	.card {
		box-sizing: border-box;
		width: 100%;
		max-width: 60em;
		max-height: 100%;
		overflow: auto;
		padding: 2.5em;
		border-radius: var(--radius-surface);
		background-color: var(--color-surface);
		box-shadow: 0 1px 3px rgb(0 0 0 / 0.08);
	}

	/* .progress {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin: 0;
		padding: 1rem;
		font-size: 0.875rem;
		color: var(--color-muted);
	}
	.dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background-color: var(--color-border);
		transition: background-color 300ms;
	}
	.dot.active {
		background-color: var(--color-accent);
	}
	.count {
		margin-inline-start: 0.5rem;
		font-variant-numeric: tabular-nums;
	} */

	/*
	 * On narrow or short screens, there is not enough room for the figure beside
	 * the narrative, so each slide shows its figure below its narrative instead
	 */
	@media (width < 50rem), (height < 32rem) {
		.sidecar {
			grid-template-columns: 1fr;
			background-color: var(--color-accent-bg);
		}

		.narrative {
			background-color: transparent;
			border: none;
			display: flex;
			flex-direction: column;
			gap: 1rem;
			padding: 1rem;
		}

		.slide {
			min-height: auto;
			padding: 1.5rem 1rem;
			opacity: 1;
			border-radius: var(--radius-surface);
			background-color: var(--color-surface);
		}

		.slide-text {
			font-size: 1.0625rem;
		}

		.inline-figure {
			display: block;
			margin-top: 1.5rem;
			padding-top: 1.5rem;
			border-top: 1px solid var(--color-border);
			font-size: 1rem;
		}

		.media {
			display: none;
		}
	}
</style>
