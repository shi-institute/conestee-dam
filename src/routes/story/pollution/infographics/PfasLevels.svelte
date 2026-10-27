<script lang="ts">
	import SampleIcon from './SampleIcon.svelte';

	/**
	 * How much higher the average levels in Lake Conestee fish are than the next-highest
	 * average in the state (Broad River just above Columbia), in percent.
	 */
	const fishComparisons = [
		{ name: 'PFOS', increase: 22 },
		{ name: 'Sum of 26 PFAS', increase: 31 }
	];

	/** The fish bars are drawn on a 0–140% scale, relative to the Broad River average. */
	const fishScaleMax = 140;
</script>

<div class="pfas-levels">
	<div class="layout">
		<section class="range-card">
			<div class="hero">
				<p class="hero-value">2–18<span class="times">×</span></p>
				<p>the Saluda Basin’s average PFAS level</p>
			</div>
			<div>
				<h3>PFAS levels are elevated at every sampled site</h3>
				<p>
					Depending on the site, PFAS levels in Lake Conestee and the Marrow Bone tributary were
					about 2 to 18 times the Saluda Basin average.
				</p>
			</div>
		</section>

		<section>
			<h3>Among the highest in South Carolina</h3>
			<ul class="facts">
				<li>
					<span class="icon"><SampleIcon type="water" /></span>
					<span>
						Levels of <strong>key PFAS compounds</strong> and the <strong>Sum of PFAS</strong> rank among
						the highest in the state’s surface waters
					</span>
				</li>
				<li>
					<span class="icon"><SampleIcon type="fish" /></span>
					<span>
						Levels in <strong>Lake Conestee fish</strong> are also among the highest in the state’s surface
						waters
					</span>
				</li>
			</ul>
		</section>

		<section>
			<h3>Highest fish tissue averages in the state</h3>
			<p>Lake Conestee freshwater fish (n=5) vs. the next-highest average in South Carolina</p>
			{#each fishComparisons as { name, increase } (name)}
				<p class="metric">{name}</p>
				<div class="bar-row">
					<span class="bar-name">Lake Conestee</span>
					<span class="bar-track">
						<span class="bar accent" style:width="{((100 + increase) / fishScaleMax) * 100}%"
						></span>
					</span>
					<span class="bar-value">+{increase}%</span>
				</div>
				<div class="bar-row">
					<span class="bar-name">Broad River <small>above Columbia</small></span>
					<span class="bar-track">
						<span class="bar" style:width="{(100 / fishScaleMax) * 100}%"></span>
					</span>
					<span class="bar-value baseline">baseline</span>
				</div>
			{/each}
		</section>

		<p class="source">
			Source: testing by the SC Department of Environmental Services (formerly SC Department of
			Health and Environmental Control), 2022–23.
		</p>
	</div>
</div>

<style>
	.pfas-levels {
		container-type: inline-size;
	}
	.layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 2em 3em;
		color: var(--color-text);
	}

	section {
		border-top: 3px solid var(--color-text);
		padding-top: 1em;
	}

	h3 {
		margin: 0 0 0.375em;
		padding: 0;
		font-size: 1.25em;
		font-weight: 700;
		line-height: 1.2;
	}
	p {
		margin: 0;
		padding: 0;
		color: var(--color-muted);
		line-height: 1.4;
	}
	strong {
		color: var(--color-text);
	}

	/* the multiplication sign in the story font is too small to read */
	.times {
		font-family: system-ui, sans-serif;
		font-weight: 500;
	}

	.range-card {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: 14em minmax(0, 1fr);
		gap: 2.5em;
		align-items: center;
	}
	.hero-value {
		font-size: 3.75em;
		font-weight: 700;
		line-height: 1;
		letter-spacing: -0.02em;
		white-space: nowrap;
		color: var(--color-accent);
		margin-bottom: 0.15em;
	}
	.hero-value .times {
		font-size: 0.55em;
		margin: 0 0.05em;
	}

	.facts {
		list-style: none;
		margin: 0.75em 0 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 1em;
	}
	.facts li {
		display: grid;
		grid-template-columns: 2.25em 1fr;
		gap: 0.75em;
		align-items: center;
		margin: 0;
		padding: 0;
		color: var(--color-muted);
		line-height: 1.4;
	}
	.facts .icon {
		width: 2.25em;
		height: 2.25em;
		color: var(--color-text);
	}

	.metric {
		margin-top: 0.875em;
		font-size: 0.875em;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-text);
	}

	.bar-row {
		display: grid;
		grid-template-columns: 8.5em minmax(0, 1fr) 4.5em;
		align-items: center;
		column-gap: 0.75em;
		margin-top: 0.375em;
	}
	.bar-name {
		font-weight: 600;
		line-height: 1.15;
	}
	.bar-name small {
		display: block;
		font-size: 0.8125em;
		font-weight: 500;
		color: var(--color-muted);
	}
	.bar {
		display: block;
		height: 1em;
		border-radius: 0 var(--radius-button) var(--radius-button) 0;
		background-color: light-dark(#a9b0bd, #6b7280);
	}
	.bar.accent {
		background-color: var(--color-accent);
	}
	.bar-value {
		text-align: right;
		font-size: 1.375em;
		font-weight: 700;
	}
	.bar-value.baseline {
		font-size: 0.875em;
		font-weight: 600;
		color: var(--color-muted);
	}

	.source {
		grid-column: 1 / -1;
		font-size: 0.8125em;
	}

	/* stack the sections on narrow screens so that the text stays readable */
	@container (width < 42em) {
		.layout {
			grid-template-columns: minmax(0, 1fr);
		}
		.range-card {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.75em;
		}
		.hero-value {
			font-size: 3em;
		}
	}

	/* phones */
	@container (width < 24em) {
		.hero-value {
			font-size: 2.5em;
		}
		.bar-row {
			grid-template-columns: 6.5em minmax(0, 1fr) 3.5em;
			column-gap: 0.5em;
		}
		.bar-value {
			font-size: 1.125em;
		}
	}
</style>
