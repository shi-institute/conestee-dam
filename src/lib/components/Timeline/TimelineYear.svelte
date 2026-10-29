<script lang="ts">
	const {
		year
	}: {
		year: number | string;
	} = $props();
</script>

<div class="timeline-year">
	<span class="timeline-year-box">
		<span class="timeline-year-label">{year}</span>
	</span>
</div>

<style>
	.timeline-year {
		display: flex;
		align-items: center;
		margin: 1.5rem 0 0.75rem 0;
		margin-left: 3.5rem;
	}

	.timeline-year-box {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 20rem;
		background-color: light-dark(#eaeaea, #2c2c2c);
		padding: 0.5rem;
		border: 1px solid light-dark(#dedede, #3a3a3a);
	}

	.timeline-year-label {
		/* Matches the gutter reserved by Timeline.Entry (--tl-line-width + --tl-line-gap). */
		font-size: 1.25rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		color: light-dark(#111, #eee);
		text-box: trim-both cap alphabetic;
	}
</style>
