<script lang="ts">
	import SampleIcon from './SampleIcon.svelte';

	/** The largest multiple of the Saluda Basin average shown on the range scale. */
	const rangeMax = 20;
	const rangePosition = (multiple: number) => `${(multiple / rangeMax) * 100}%`;

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
	<section class="range-card">
		<div class="hero">
			<p class="hero-value">
				~2<span class="times">×</span>–18<span class="times">×</span>
			</p>
			<p>the Saluda Basin average</p>
		</div>
		<div>
			<h3>Sum of PFAS-26 at every sampled location</h3>
			<p>in Lake Conestee and the Marrow Bone tributary</p>
			<div class="range" aria-hidden="true">
				<span class="range-label base-label" style:left={rangePosition(1)}>
					Basin average (1<span class="times">×</span>)
				</span>
				<span class="range-track"></span>
				<span
					class="range-band"
					style:left={rangePosition(2)}
					style:right="calc(100% - {rangePosition(18)})"
				></span>
				<span class="range-base" style:left={rangePosition(1)}></span>
				{#each [0, 5, 10, 15, 20] as tick (tick)}
					<span class="range-tick" style:left={rangePosition(tick)}>
						{tick}<span class="times">×</span>
					</span>
				{/each}
			</div>
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
			<div class="fish-row">
				<span class="fish-name">Lake Conestee</span>
				<span class="fish-track">
					<span class="fish-bar conestee" style:width="{((100 + increase) / fishScaleMax) * 100}%"
					></span>
				</span>
				<span class="fish-value">+{increase}%</span>
			</div>
			<div class="fish-row">
				<span class="fish-name">Broad River <small>above Columbia</small></span>
				<span class="fish-track">
					<span class="fish-bar" style:width="{(100 / fishScaleMax) * 100}%"></span>
				</span>
				<span class="fish-value baseline">baseline</span>
			</div>
		{/each}
	</section>

	<p class="source">
		Source: testing by the SC Department of Environmental Services (formerly SC Department of Health
		and Environmental Control), 2022–23.
	</p>
</div>

<style>
	.pfas-levels {
		container-type: inline-size;
		display: grid;
		grid-template-columns: 1fr 1fr;
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
		grid-template-columns: 14em 1fr;
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

	.range {
		position: relative;
		height: 5.5em;
		margin: 0.5em 0.75em 0 0;
	}
	.range-track,
	.range-band {
		position: absolute;
		top: 2.25em;
		height: 0.75em;
		border-radius: 4px;
	}
	.range-track {
		left: 0;
		right: 0;
		background-color: light-dark(#eef1f6, #333);
	}
	.range-band {
		background-color: var(--color-accent);
	}
	.range-base {
		position: absolute;
		top: 1.6em;
		width: 3px;
		height: 2em;
		margin-left: -1.5px;
		background-color: var(--color-text);
	}
	.range-label {
		position: absolute;
		font-size: 0.875em;
		font-weight: 600;
		white-space: nowrap;
	}
	.range-label.base-label {
		top: 0;
		transform: translateX(-0.75em);
	}
	.range-tick {
		position: absolute;
		top: 3.5em;
		font-size: 0.8125em;
		color: var(--color-muted);
		transform: translateX(-50%);
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
	.fish-row {
		display: grid;
		grid-template-columns: 8.5em 1fr 4.5em;
		align-items: center;
		column-gap: 0.75em;
		margin-top: 0.375em;
	}
	.fish-name {
		font-weight: 600;
		line-height: 1.15;
	}
	.fish-name small {
		display: block;
		font-size: 0.8125em;
		font-weight: 500;
		color: var(--color-muted);
	}
	.fish-bar {
		display: block;
		height: 1em;
		border-radius: 0 4px 4px 0;
		background-color: light-dark(#a9b0bd, #6b7280);
	}
	.fish-bar.conestee {
		background-color: var(--color-accent);
	}
	.fish-value {
		text-align: right;
		font-size: 1.375em;
		font-weight: 700;
	}
	.fish-value.baseline {
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
		.pfas-levels {
			grid-template-columns: 1fr;
		}
		.range-card {
			grid-template-columns: 1fr;
			gap: 0.75em;
		}
		.hero-value {
			font-size: 3em;
		}
	}
</style>
