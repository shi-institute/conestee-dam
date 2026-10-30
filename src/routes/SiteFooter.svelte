<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import logo from '$lib/assets/favicon.svg';
	import { stories } from '$lib/stories';
	import videos from '$lib/videos/videos.json';

	const firstVideo = videos.find((video) => video.id === 1);

	/**
	 * Whether the current page is the video page, which fills the viewport on wide screens
	 * (so a footer below it would only add an extra scrollbar).
	 */
	const isVideoPage = $derived(page.route.id?.startsWith('/video') ?? false);

	let footerHeight = $state(0);
	$effect(() => {
		document.documentElement.style.setProperty('--footer-height', `${footerHeight}px`);
		return () => document.documentElement.style.removeProperty('--footer-height');
	});

	function scrollToTop(event: MouseEvent) {
		event.preventDefault();
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
	}
</script>

<footer class:video-page={isVideoPage} bind:offsetHeight={footerHeight}>
	<div class="inner">
		<div class="brand">
			<a class="brand-link" href={resolve('/')}>
				<img src={logo} alt="" width="40" height="40" />
				<span class="brand-main">Lake Conestee Dam</span>
			</a>
			<p>
				The story of the Lake Conestee Dam on the Reedy River: its history, the pollution it holds
				back, and the new dam built to contain it.
			</p>
		</div>

		<nav aria-label="Footer">
			<h2>Explore</h2>
			<ul>
				<li>
					<a href={resolve(`video/${firstVideo?.codes[0] || firstVideo?.id || 1}`)}>Documentary</a>
				</li>
				{#each stories as story (story.href)}
					<li>
						<a href={resolve(...([story.href] as Parameters<typeof resolve>))}>{story.label}</a>
					</li>
				{/each}
				<li><a href={resolve('/glossary')}>Glossary</a></li>
			</ul>
		</nav>
	</div>

	<div class="bottom">
		<div class="inner">
			<p>Greenville, South Carolina</p>
			<a class="top-link" href="#top" onclick={scrollToTop}>
				Back to top
				<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
					<path
						d="M4.284 10.295a1 1 0 0 0 1.424 1.404L11 6.33v13.67a1 1 0 1 0 2 0V6.336l5.285 5.364a1 1 0 0 0 1.424-1.404L12.887 3.37a1.25 1.25 0 0 0-1.78 0l-6.823 6.924Z"
						fill="currentColor"
					/>
				</svg>
			</a>
		</div>
	</div>
</footer>

<style>
	footer {
		/* the footer is dark in both color schemes, matching the home page hero */
		--footer-link: #c5dbff;
		--footer-muted: #aab8d4;
		--footer-border: rgba(197 219 255 / 18%);

		background-color: var(--color-accent-dark);
		color: white;
		line-height: 1.5;
	}

	/* a loading story fills the viewport and cannot be scrolled, so the footer waits for it */
	:global(body:has(.storymap-embed-wrapper.loading)) footer {
		display: none;
	}

	/* the video page fills the viewport on wide screens */
	@media (min-width: 1000px) {
		footer.video-page {
			display: none;
		}
	}

	.inner {
		box-sizing: border-box;
		max-width: 68rem;
		margin-inline: auto;
		padding-inline: 1.5rem;
	}

	footer > .inner {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2.5rem;
		padding-block: 3rem 2.5rem;
	}

	@media (min-width: 800px) {
		footer > .inner {
			grid-template-columns: minmax(16rem, 1fr) 2fr;
			gap: 4rem;
		}
	}

	/* brand */
	.brand-link {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		color: inherit;
		text-decoration: none;
	}

	.brand-link img {
		flex: none;
	}

	.brand-main {
		font-size: 1.5rem;
		font-weight: 600;
		line-height: 1;
		letter-spacing: -0.02em;
	}

	.brand-link:hover .brand-main {
		text-decoration: underline;
		text-decoration-thickness: 2px;
		text-underline-offset: 3px;
	}

	.brand p {
		margin: 1rem 0 0;
		max-width: 22rem;
		color: var(--footer-muted);
		font-size: 0.95rem;
	}

	/* links */
	h2 {
		margin: 0 0 0.75rem;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--footer-muted);
	}

	/* the links flow into as many as two columns */
	ul {
		columns: 2 12rem;
		column-gap: 2rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		break-inside: avoid;
		margin-bottom: 0.5rem;
	}

	nav a,
	.top-link {
		color: var(--footer-link);
		font-weight: 500;
		text-decoration: none;
	}

	nav a:hover,
	.top-link:hover {
		color: white;
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	nav a:active,
	.top-link:active {
		opacity: 0.7;
	}

	a:focus-visible {
		outline: 3px solid var(--footer-link);
		outline-offset: 2px;
	}

	.top-link {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}

	.top-link svg {
		flex: none;
		width: 1rem;
		height: 1rem;
	}

	/* bottom bar */
	.bottom {
		border-top: 1px solid var(--footer-border);
	}

	.bottom .inner {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem 1.5rem;
		padding-block: 1.25rem;
		font-size: 0.875rem;
	}

	.bottom p {
		margin: 0;
		color: var(--footer-muted);
	}
</style>
