<script lang="ts">
	import SampleIcon, { type SampleType } from './SampleIcon.svelte';

	type Row = [type: SampleType, percent: number];

	const {
		contaminant,
		humanHealth,
		ecological
	}: {
		/** How the contaminant group is named in the chart headings, such as "metals". */
		contaminant: string;

		/** The percent of samples exceeding human health screening values, by sample type. */
		humanHealth: Row[];

		/** The percent of samples exceeding ecological screening values, by sample type. */
		ecological: Row[];
	} = $props();

	const labels: Record<SampleType, string> = {
		exposed: 'Exposed sediments',
		submerged: 'Submerged sediments',
		downriver: 'Downriver sediments',
		water: 'Surface water',
		fish: 'Fish tissue'
	};
</script>

{#snippet chart(kind: 'human' | 'ecological', rows: Row[])}
	<section class="chart {kind}">
		<h3>
			<span class="key" aria-hidden="true"></span>
			Percent of Lake Conestee samples exceeding
			<strong>{kind === 'human' ? 'human health' : 'ecological'} screening values</strong>
			for {contaminant}
		</h3>
		<ul>
			{#each rows as [type, percent] (type)}
				<li>
					<span class="icon"><SampleIcon {type} /></span>
					<span class="label">{labels[type]}</span>
					<span class="track" aria-hidden="true">
						{#if percent > 0}
							<span class="fill" style:width="{percent}%"></span>
						{/if}
					</span>
					<span class="value" class:zero={percent === 0}>{percent}%</span>
				</li>
			{/each}
		</ul>
		<div class="scale" aria-hidden="true">
			<div><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>
		</div>
	</section>
{/snippet}

<div class="screening-values">
	{@render chart('human', humanHealth)}
	{@render chart('ecological', ecological)}
</div>

<style>
	.screening-values {
		container-type: inline-size;
		display: flex;
		flex-direction: column;
		gap: 2.5em;
		color: var(--color-text);
	}

	.chart.human {
		--chart-color: var(--color-accent);
	}
	.chart.ecological {
		--chart-color: light-dark(#2f8578, #7cc9ba);
	}

	h3 {
		margin: 0 0 0.75em;
		padding: 0;
		font-size: 1.125em;
		font-weight: 500;
		line-height: 1.3;
		color: var(--color-muted);
	}
	h3 strong {
		font-weight: 700;
		color: var(--color-text);
	}
	.key {
		display: inline-block;
		width: 0.7em;
		height: 0.7em;
		margin-right: 0.35em;
		border-radius: 2px;
		background-color: var(--chart-color);
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		border-bottom: 1px solid var(--color-border);
	}

	li,
	.scale {
		display: grid;
		grid-template-columns: 2em 11.5em 1fr 4em;
		grid-template-areas: 'icon label track value';
		align-items: center;
		column-gap: 0.75em;
	}
	li {
		margin: 0;
		padding: 0.375em 0;
		min-height: 2.75em;
		border-top: 1px solid var(--color-border);
	}

	.icon {
		grid-area: icon;
		width: 2em;
		height: 2em;
		color: var(--color-text);
	}
	.label {
		grid-area: label;
		font-weight: 600;
		line-height: 1.2;
	}

	.track {
		grid-area: track;
		position: relative;
		height: 1.1em;
		border-radius: 4px;
		overflow: hidden;
		/* faint gridlines at 25%, 50%, and 75% */
		background:
			linear-gradient(
					to right,
					transparent calc(25% - 1px),
					var(--color-surface) 0 25%,
					transparent 0
				)
				0 0 / 100% 100%,
			linear-gradient(
					to right,
					transparent calc(50% - 1px),
					var(--color-surface) 0 50%,
					transparent 0
				)
				0 0 / 100% 100%,
			linear-gradient(
					to right,
					transparent calc(75% - 1px),
					var(--color-surface) 0 75%,
					transparent 0
				)
				0 0 / 100% 100%,
			light-dark(#eef1f6, #333);
	}
	.fill {
		position: absolute;
		inset: 0 auto 0 0;
		border-radius: 0 4px 4px 0;
		background-color: var(--chart-color);
	}

	.value {
		grid-area: value;
		text-align: right;
		font-size: 1.5em;
		font-weight: 700;
		line-height: 1;
	}
	.value.zero {
		color: var(--color-muted);
	}

	.scale {
		margin-top: 0.375em;
		font-size: 0.8125em;
		color: var(--color-muted);
	}
	.scale > div {
		grid-area: track;
		display: flex;
		justify-content: space-between;
	}

	/* on narrow screens, put the bars below the labels so neither is squished */
	@container (width < 30em) {
		li,
		.scale {
			grid-template-columns: 1.75em 1fr auto;
			grid-template-areas:
				'icon label value'
				'track track track';
			row-gap: 0.5em;
		}
		li {
			padding: 0.625em 0 0.75em;
		}
		.icon {
			width: 1.75em;
			height: 1.75em;
		}
		.value {
			font-size: 1.25em;
		}
		.scale {
			grid-template-areas: 'track track track';
		}
	}
</style>
