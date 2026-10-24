<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { wrapImagesInLightbox } from '$lib/components';
	import newDam from './new-dam.webp?enhanced';
	import oldDam from './old-dam.webp?enhanced';
	import historicMap from './story/pollution/Sanborn-ConesteeMills-1920.png?enhanced';

	const stories = [
		{
			href: '/story/pollution',
			label: 'Pollution history',
			description:
				'Textile mills, power plants, sewage, and more: how many kinds of pollution reached the Reedy River.'
		},
		{
			href: '/story/sediment',
			label: 'Sediment aggradation',
			description: 'An exploration of how sediment has reduced the size of Lake Conestee over time.'
		},
		{
			href: '/story/watershed',
			label: 'About the watershed',
			description:
				'What a watershed is and how it works, the Reedy River watershed, and the challenges of an aging dam.'
		},
		{
			href: '/story/timeline',
			label: 'Timeline',
			description:
				'A chronological timeline of the dam, the mills, and the river since the 19ᵗʰ century.'
		},
		{
			href: '/story/dam',
			label: 'The new dam',
			description: 'Completed in 2025, a containment barrier built just downstream of the old dam.'
		}
	] as const;

	let exploreDialog: HTMLDialogElement | null = null;
	let exploreButton: HTMLButtonElement | null = null;
	afterNavigate(() => {
		exploreDialog?.close();
	});

	/**
	 * Opens the explore dialog as a modal (which makes everything else inert) and
	 * vertically centers it on the button that opened it (when space allows).
	 * This keeps the dialog near the pointer on tall screens.
	 */
	function openExploreDialog() {
		if (!exploreDialog || !exploreButton) return;
		exploreDialog.showModal();

		const margin = 16;
		const buttonRect = exploreButton.getBoundingClientRect();
		const buttonCenter = buttonRect.top + buttonRect.height / 2;
		const dialogHeight = exploreDialog.offsetHeight;
		const maxTop = window.innerHeight - dialogHeight - margin;
		exploreDialog.style.top = `${Math.max(margin, Math.min(buttonCenter - dialogHeight / 2, maxTop))}px`;
	}

	/** Closes the explore dialog when its backdrop (but not its content) is clicked. */
	function handleExploreDialogClick(event: MouseEvent) {
		if (event.target === exploreDialog) exploreDialog?.close();
	}

	/** Placeholder contributors. Replace with real names, roles, and photos. */
	const contributors = Array.from({ length: 10 }, () => ({
		name: 'Name',
		role: 'Role'
	}));

	const facts = [
		{ era: 'old', value: '1892', label: 'Year the original stone-masonry dam was built' },
		{ era: 'new', value: '2025', label: 'Year the new containment dam was completed' }
	] as const;

	/** Which dam is shown in the hero photo. */
	let era = $state<(typeof facts)[number]['era']>('new');
</script>

<svelte:head>
	<title>Lake Conestee Dam</title>
	<meta
		name="description"
		content="The story of the Lake Conestee Dam on the Reedy River: its history, the pollution it holds back, and the new dam built to contain it."
	/>
</svelte:head>

{#snippet exploreContent(headingId?: string)}
	<h2 id={headingId}>Explore the stories</h2>
	<ul class="cards">
		{#each stories as story (story.href)}
			<li>
				<a href={resolve(story.href)}>
					<h3>{story.label}</h3>
					<p>{story.description}</p>
					<span class="more" aria-hidden="true">Read the story →</span>
				</a>
			</li>
		{/each}
	</ul>
	<p class="glossary-note">
		Unfamiliar term? Check the <a href={resolve('/glossary')}>glossary</a>.
	</p>
{/snippet}

<dialog
	class="home explore-dialog"
	tabindex="-1"
	autofocus
	aria-labelledby="explore-dialog-heading"
	bind:this={exploreDialog}
	onclick={handleExploreDialogClick}
>
	<div class="dialog-body">
		<button class="close" onclick={() => exploreDialog?.close()} title="Close" aria-label="Close">
			<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
				<path
					d="m4.397 4.554.073-.084a.75.75 0 0 1 .976-.073l.084.073L12 10.939l6.47-6.47a.75.75 0 1 1 1.06 1.061L13.061 12l6.47 6.47a.75.75 0 0 1 .072.976l-.073.084a.75.75 0 0 1-.976.073l-.084-.073L12 13.061l-6.47 6.47a.75.75 0 0 1-1.06-1.061L10.939 12l-6.47-6.47a.75.75 0 0 1-.072-.976l.073-.084-.073.084Z"
					fill="currentColor"
				/>
			</svg>
		</button>
		{@render exploreContent('explore-dialog-heading')}
	</div>
</dialog>

<main class="home">
	<section class="hero">
		<div class="hero-photo" aria-hidden="true">
			<div class="layer" class:active={era === 'old'}>
				<enhanced:img src={oldDam} alt="" sizes="100vw" />
			</div>
			<div class="layer" class:active={era === 'new'}>
				<enhanced:img src={newDam} alt="" sizes="100vw" fetchpriority="high" />
			</div>
		</div>
		<div class="hero-inner">
			<h1>
				<span class="title-main">Containment<span class="visually-hidden">:</span></span>
				<span class="title-sub">The Conestee Dam Story</span>
			</h1>
			<p class="lead">
				Since 1892, a dam on the Reedy River has shaped the land, the water, and the communities
				around it. Explore how Lake Conestee came to hold more than a century of sediment, and how a
				new dam now keeps it in place.
			</p>
			<div class="actions">
				<a class="button primary" href={resolve('/story')}>
					<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
						><path
							d="M7.60846 4.61489C7.1087 4.34296 6.5 4.70472 6.5 5.27368V18.726C6.5 19.2949 7.1087 19.6567 7.60846 19.3848L19.97 12.6586C20.4921 12.3746 20.4921 11.6251 19.97 11.341L7.60846 4.61489ZM5 5.27368C5 3.56682 6.82609 2.48151 8.32538 3.2973L20.687 10.0235C22.2531 10.8756 22.2531 13.124 20.687 13.9762L8.32538 20.7024C6.82609 21.5181 5 20.4328 5 18.726V5.27368Z"
							fill="currentColor"
						/></svg
					>
					Watch the documentary
				</a>
				<button class="button" bind:this={exploreButton} onclick={openExploreDialog}>
					<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
						><path
							d="M4 3H5C6.05382 3 6.91812 3.8164 6.99451 4.85081L7 5V19C7 20.0538 6.1836 20.9181 5.14919 20.9945L5 21H4C2.94618 21 2.08188 20.1836 2.00549 19.1492L2 19V5C2 3.94618 2.8164 3.08188 3.85081 3.00549L4 3H5H4ZM10 3H11C12.0538 3 12.9181 3.8164 12.9945 4.85081L13 5V19C13 20.0538 12.1836 20.9181 11.1492 20.9945L11 21H10C8.94618 21 8.08188 20.1836 8.00549 19.1492L8 19V5C8 3.94618 8.8164 3.08188 9.85081 3.00549L10 3H11H10ZM16.9743 5.0005C17.8138 5.0005 18.5825 5.5311 18.8643 6.34636L18.9113 6.5025L21.9263 18.2485C22.1888 19.2689 21.613 20.3094 20.6295 20.6402L20.4863 20.6825L19.5173 20.9315C19.3513 20.9735 19.1833 20.9945 19.0193 20.9945C18.1807 20.9945 17.4112 20.463 17.1302 19.6476L17.0833 19.4915L14.0673 7.7465C13.8058 6.72514 14.3807 5.68555 15.3649 5.35484L15.5083 5.3125L16.4763 5.0635C16.6423 5.0205 16.8103 5.0005 16.9743 5.0005ZM5 4.5H4C3.75467 4.5 3.55042 4.67778 3.50806 4.91043L3.5 5V19C3.5 19.2444 3.67699 19.4494 3.91016 19.4919L4 19.5H5C5.24533 19.5 5.44958 19.3222 5.49194 19.0896L5.5 19V5C5.5 4.75556 5.32301 4.55062 5.08984 4.50809L5 4.5ZM11 4.5H10C9.75467 4.5 9.55042 4.67778 9.50806 4.91043L9.5 5V19C9.5 19.2444 9.67699 19.4494 9.91016 19.4919L10 19.5H11C11.2453 19.5 11.4496 19.3222 11.4919 19.0896L11.5 19V5C11.5 4.75556 11.323 4.55062 11.0898 4.50809L11 4.5ZM16.9753 6.5005L16.9119 6.50437L16.8493 6.5165L15.8813 6.7645C15.7063 6.8095 15.6143 6.9275 15.5743 6.9955C15.5431 7.0483 15.4985 7.14718 15.5049 7.27422L15.5203 7.3745L18.5363 19.1185C18.6023 19.3765 18.8333 19.4945 19.0193 19.4945L19.0818 19.4906L19.1443 19.4785L20.1133 19.2295C20.3515 19.1691 20.5052 18.9458 20.4879 18.7102L20.4733 18.6215L17.4583 6.8755C17.3913 6.6185 17.1613 6.5005 16.9753 6.5005Z"
							fill="currentColor"
						/></svg
					>
					Explore the stories
				</button>
			</div>
		</div>
	</section>

	<section class="facts" aria-label="Key facts">
		<dl>
			{#each facts as fact (fact.value)}
				<div class:selected={era === fact.era}>
					<dt>
						<button
							class="year"
							aria-pressed={era === fact.era}
							onclick={() => (era = fact.era)}
							title="Show the {fact.era} dam in the photo above"
						>
							{fact.value}
						</button>
					</dt>
					<dd>{fact.label}</dd>
				</div>
			{/each}
		</dl>
	</section>

	<section class="about">
		<div class="about-text">
			<h2>A river's history, settled in sediment</h2>
			<p>
				Built in 1892 to power a textile mill, the Lake Conestee Dam has stood for more than a
				century, and its reservoir has shaped the area through many phases of its history. Over
				those decades, mills, power plants, sewage, and industry sent contaminated sediment down the
				Reedy River, and much of it came to rest behind the dam.
			</p>
			<p>
				Today, the new Lake Conestee Dam acts as a containment barrier so that sediment cannot be
				released if the old dam were to fail. The lake is also home to a nature preserve. These
				stories walk through how we arrived here.
			</p>
		</div>
		<figure {@attach wrapImagesInLightbox}>
			<enhanced:img
				src={historicMap}
				alt="Sanborn fire insurance map of Conestee Mills, 1920"
				sizes="(min-width: 800px) 480px, 100vw"
			/>
			<figcaption>Sanborn fire insurance map of Conestee Mills, 1920</figcaption>
		</figure>
	</section>

	<section class="explore" id="explore">
		{@render exploreContent()}
	</section>

	<section class="credits" aria-labelledby="credits-heading">
		<h2 id="credits-heading">Contributors</h2>
		<ul class="contributors">
			{#each contributors as contributor, i (i)}
				<li>
					<div class="photo" aria-hidden="true">
						<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M17.754 14a2.249 2.249 0 0 1 2.25 2.249v.575c0 .894-.32 1.76-.901 2.438C17.534 20.1 15.145 21 12 21s-5.532-.9-7.1-2.74a3.75 3.75 0 0 1-.896-2.434v-.577A2.249 2.249 0 0 1 6.253 14h11.5Zm0 1.5h-11.5a.749.749 0 0 0-.75.749v.577c0 .536.192 1.054.54 1.461C7.5 19.5 9.436 20.5 12 20.5s4.5-1 5.96-2.213c.35-.407.543-.925.543-1.462v-.576a.749.749 0 0 0-.75-.749ZM12 2.004a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"
								fill="currentColor"
							/>
						</svg>
					</div>
					<div class="details">
						<h3>{contributor.name}</h3>
						<p class="role">{contributor.role}</p>
					</div>
				</li>
			{/each}
		</ul>
	</section>
</main>

<style>
	:global(:root:has(.home)) {
		color-scheme: light dark;
	}

	.home {
		--accent: light-dark(#4868a9, #c5dbff);
		--accent-bg: light-dark(#ecf3ff, #303030);
		--border: light-dark(#ccc, #333);
		--muted: light-dark(#555, #b5b5b5);
		--content-width: 68rem;
		color: light-dark(#1a1a1a, #f0f0f0);
		line-height: 1.55;
	}

	h1,
	h2,
	h3 {
		line-height: 1.15;
		margin: 0;
	}

	section {
		padding: 3.5rem 1.5rem;
	}

	section > :global(*) {
		max-width: var(--content-width);
		margin-inline: auto;
	}

	/* hero */
	.hero {
		/* the photo is the same in light and dark mode, so the hero uses light text on a scrim */
		--accent: #c5dbff;
		position: relative;
		isolation: isolate;
		color: white;
		background-color: #1f2c47;
		padding-block: clamp(5rem, 22vh, 12rem);
	}

	.hero-photo {
		position: absolute;
		inset: 0;
		z-index: -1;
		max-width: none;
		margin: 0;
	}

	.hero-photo::after {
		content: '';
		position: absolute;
		inset: 0;
		background:
			linear-gradient(to bottom, rgba(10 20 40 / 35%), transparent 30%, rgba(10 20 40 / 40%)),
			linear-gradient(to right, rgba(10 20 40 / 75%), rgba(10 20 40 / 25%));
	}

	.hero-photo .layer {
		position: absolute;
		inset: 0;
		opacity: 0;
		transition: opacity 400ms ease-in-out;
	}

	.hero-photo .layer.active {
		opacity: 1;
	}

	.hero-photo :global(picture),
	.hero-photo :global(img) {
		display: block;
		width: 100%;
		height: 100%;
	}

	.hero-photo :global(img) {
		object-fit: cover;
		object-position: 50% 40%;
	}

	.hero-inner {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	h1 {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.title-main {
		font-size: clamp(3rem, 11vw, 7.5rem);
		font-weight: 800;
		line-height: 0.95;
		letter-spacing: -0.03em;
		text-shadow: 0 2px 24px rgba(0 0 0 / 35%);
	}

	.title-sub {
		display: flex;
		align-items: center;
		gap: 1rem;
		font-size: clamp(1rem, 2.6vw, 1.5rem);
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.title-sub::before {
		content: '';
		flex: none;
		width: clamp(2rem, 6vw, 4rem);
		height: 3px;
		border-radius: 2px;
		background-color: currentColor;
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.lead {
		margin: 0;
		max-width: 40rem;
		font-size: clamp(1.1rem, 2.4vw, 1.4rem);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 0.5rem;
	}

	.button {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		background-color: transparent;
		font: inherit;
		cursor: default;
		padding: 0.7rem 1.25rem;
		border: 1px solid var(--accent);
		border-radius: 0.25rem;
		color: var(--accent);
		font-weight: 600;
		text-decoration: none;
		transition: background-color 80ms ease-in-out;
	}

	.button svg {
		flex: none;
		width: 1.4rem;
		height: 1.4rem;
	}

	.button:hover {
		background-color: light-dark(#d6e2ff, #3a3a3a);
	}

	.button:active {
		background-color: light-dark(#c3d4f5, #444);
	}

	.button.primary {
		background-color: light-dark(#4868a9, #c5dbff);
		color: light-dark(white, #1a1a1a);
	}

	.button.primary:hover {
		background-color: light-dark(#3b5791, #d6e2ff);
	}

	.button.primary:active {
		background-color: light-dark(#2f4778, #e6eeff);
	}

	/* buttons over the hero photo */
	.hero .button {
		border-color: white;
		color: white;
	}

	.hero .button:hover {
		background-color: rgba(255 255 255 / 20%);
	}

	.hero .button:active {
		background-color: rgba(255 255 255 / 30%);
	}

	.hero .button.primary {
		background-color: white;
		color: #1f2c47;
	}

	.hero .button.primary:hover {
		background-color: #e6eeff;
	}

	.hero .button.primary:active {
		background-color: #d6e2ff;
	}

	a:focus-visible,
	button:focus-visible {
		outline: 3px solid var(--accent);
		outline-offset: 2px;
	}

	/* facts */
	.facts {
		padding-block: 3.5rem 1rem;
	}

	dl {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: 1.5rem;
		margin-block: 0;
	}

	dl div {
		padding-top: 1rem;
		border-top: 3px solid var(--accent);
		transition: border-color 80ms ease-in-out;
	}

	dl div:not(.selected) {
		border-top-color: var(--border);
	}

	dt {
		margin: 0;
	}

	.year {
		margin: 0 0 0 -0.5rem;
		padding: 0.25rem 0.5rem;
		border: none;
		border-radius: 0.5rem;
		background-color: transparent;
		cursor: pointer;
		font: inherit;
		font-size: 2.75rem;
		font-weight: 800;
		line-height: 1;
		color: var(--muted);
		transition:
			background-color 80ms ease-in-out,
			color 80ms ease-in-out;
	}

	.selected .year {
		color: var(--accent);
	}

	.year:hover {
		background-color: var(--accent-bg);
		color: var(--accent);
	}

	.year:active {
		background-color: light-dark(#d6e2ff, #3a3a3a);
	}

	dd {
		margin: 0.4rem 0 0;
		color: var(--muted);
	}

	/* about */
	.about {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2.5rem;
		align-items: center;
		max-width: var(--content-width);
		margin-inline: auto;
	}

	.about > :global(*) {
		max-width: none;
	}

	@media (min-width: 800px) {
		.about {
			grid-template-columns: 1.1fr 1fr;
		}
	}

	h2 {
		font-size: clamp(1.75rem, 4vw, 2.5rem);
		font-weight: 700;
		margin-bottom: 1rem;
	}

	.about-text p {
		margin: 0 0 1rem;
		font-size: 1.1rem;
	}

	figure {
		margin: 0;
	}

	figure :global(img) {
		display: block;
		width: 100%;
		height: auto;
		border: 1px solid var(--border);
		border-radius: 0.25rem;
	}

	figure :global(img[data-lightbox-enhanced]) {
		transition:
			border-color 80ms ease-in-out,
			opacity 80ms ease-in-out;
	}

	figure :global(img[data-lightbox-enhanced]:hover) {
		border-color: var(--accent);
	}

	figure :global(img[data-lightbox-enhanced]:active) {
		opacity: 0.85;
	}

	figcaption {
		margin-top: 0.5rem;
		font-size: 0.85rem;
		color: var(--muted);
	}

	/* explore */
	.explore {
		background-color: var(--accent-bg);
	}

	.explore-dialog {
		box-sizing: border-box;
		width: min(100% - 2rem, 62rem);
		/* the top is set when the dialog opens so it lines up with the button */
		top: 1rem;
		bottom: auto;
		margin: 0 auto;
		padding: 0;
		overflow: hidden;
		border: 1px solid var(--border);
		border-radius: 0.25rem;
		background-color: light-dark(white, #212121);
		color: light-dark(#1a1a1a, #f0f0f0);
		box-shadow:
			0 32px 64px rgba(0 0 0 / 25%),
			0 2px 21px rgba(0 0 0 / 20%);

		/* animate out by keeping the dialog displayed until the animation ends */
		animation: dialog-out 167ms cubic-bezier(0, 0, 0, 1);
		transition:
			display 167ms allow-discrete,
			overlay 87ms allow-discrete;
	}

	.explore-dialog:focus-visible {
		outline: none;
	}

	.explore-dialog:open {
		animation-name: dialog-in;
	}

	.explore-dialog::backdrop {
		background-color: rgba(0 0 0 / 30%);
		animation: fade-out 87ms linear;
	}

	.explore-dialog:open::backdrop {
		animation-name: fade-in;
	}

	.dialog-body {
		box-sizing: border-box;
		max-height: calc(100dvh - 2rem - 2px);
		padding: 2rem 1.5rem 1.5rem;
		overflow-y: auto;
	}

	@keyframes dialog-in {
		from {
			opacity: 0;
			transform: scale(1.05);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes dialog-out {
		from {
			opacity: 1;
			transform: scale(1);
		}
		to {
			opacity: 0;
			transform: scale(1.05);
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes fade-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}

	.explore-dialog h2 {
		padding-right: 2.5rem;
	}

	.close {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		display: grid;
		place-items: center;
		width: 2.25rem;
		height: 2.25rem;
		padding: 0.4rem;
		border: none;
		border-radius: 0.25rem;
		background-color: transparent;
		color: var(--accent);
		transition: background-color 80ms ease-in-out;
	}

	.close:hover {
		background-color: light-dark(#ecf3ff, #303030);
	}

	.close:active {
		background-color: light-dark(#d6e2ff, #3a3a3a);
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
		gap: 1rem;
		margin-block: 0;
		padding: 0;
		list-style: none;
	}

	.cards a {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		height: 100%;
		box-sizing: border-box;
		padding: 1.25rem;
		background-color: light-dark(white, #212121);
		border: 1px solid var(--border);
		border-radius: 0.25rem;
		color: inherit;
		text-decoration: none;
		cursor: pointer;
		transition:
			border-color 80ms ease-in-out,
			background-color 80ms ease-in-out,
			box-shadow 80ms ease-in-out,
			transform 80ms ease-in-out;
	}

	.cards a:hover {
		border-color: var(--accent);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0 0 0 / 12%);
	}

	.cards a:active {
		transform: translateY(0);
		box-shadow: none;
		background-color: var(--accent-bg);
	}

	.cards a:hover .more {
		text-decoration: underline;
	}

	h3 {
		font-size: 1.25rem;
		color: var(--accent);
	}

	.cards p {
		margin: 0;
		color: var(--muted);
	}

	.more {
		margin-top: auto;
		padding-top: 0.5rem;
		font-weight: 600;
		color: var(--accent);
	}

	.glossary-note {
		margin-top: 1.5rem;
	}

	.glossary-note a {
		color: var(--accent);
	}

	.glossary-note a:hover {
		text-decoration-thickness: 2px;
	}

	.glossary-note a:active {
		opacity: 0.7;
	}

	/* credits */
	.contributors {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
		gap: 1.5rem;
		margin-block: 0;
		padding: 0;
		list-style: none;
	}

	.contributors > li {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.photo {
		flex: none;
		display: grid;
		place-items: center;
		width: 6rem;
		height: 6rem;
		border-radius: 50%;
		background-color: var(--accent-bg);
		border: 1px solid var(--border);
		color: var(--accent);
	}

	.photo svg {
		width: 3rem;
		height: 3rem;
	}

	.contributors h3 {
		font-size: 1.1rem;
		color: inherit;
	}

	.role {
		margin: 0.25rem 0 0;
		color: var(--muted);
	}

	@media (prefers-reduced-motion: reduce) {
		.cards a,
		.button,
		.close,
		.year,
		.hero-photo .layer {
			transition: none;
		}
		.explore-dialog,
		.explore-dialog::backdrop {
			animation-duration: 0s;
		}
		.cards a:hover,
		.cards a:active {
			transform: none;
		}
	}
</style>
